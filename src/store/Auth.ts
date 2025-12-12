import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { AppwriteException, ID, Models, OAuthProvider } from "appwrite";
import { account } from "@/models/client/config";

export interface UserPrefs {
  reputation: number;
  avatar?: string;
}

interface IAuthStore {
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<UserPrefs> | null;
  hydrated: boolean;

  setHydrated(): void;
  verifySession(): Promise<void>;
  login(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  createAccount(
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  logout(): Promise<void>;
  loginWithGoogle(): void;
  loadOAuthSession(): Promise<boolean>; // Changed return type to boolean
  fetchGoogleImage: () => Promise<string | null>;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set, get) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated() {
        set({ hydrated: true });
      },

      async verifySession() {
        try {
          const session = await account.getSession("current");
          set({ session });
        } catch {
          // no session = ignore
        }
      },

      fetchGoogleImage: async () => {
        try {
          // A. Get the session to find the provider token
          const session = await account.getSession("current");

          // Check if we actually have a Google token
          if (session.provider !== "google" || !session.providerAccessToken) {
            return null;
          }

          // B. Call Google API directly using the token
          const response = await fetch(
            "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
            {
              headers: {
                Authorization: `Bearer ${session.providerAccessToken}`,
              },
            }
          );

          if (!response.ok) return null;

          const googleData = await response.json();

          // C. Google returns a 'picture' field with the URL
          return googleData.picture as string; // This is your HD Google Image URL
        } catch (error) {
          console.error("Failed to fetch Google image", error);
          return null;
        }
      },

      async login(email, password) {
        try {
          try {
            await account.deleteSession("current");
          } catch {}

          const session = await account.createEmailPasswordSession(
            email,
            password
          );

          const [user, { jwt }] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT(),
          ]);

          if (!user.prefs?.reputation) {
            await account.updatePrefs<UserPrefs>({ reputation: 0 });
          }

          set({ session, user, jwt });
          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async createAccount(name, email, password) {
        try {
          try {
            await account.deleteSession("current");
          } catch {}

          await account.create(ID.unique(), email, password, name);

          // Fixed circular dependency by using get()
          return await get().login(email, password);
        } catch (error) {
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async logout() {
        try {
          await account.deleteSessions();
          set({ session: null, jwt: null, user: null });
        } catch (error) {
          console.log(error);
        }
      },

      loginWithGoogle() {
        account.createOAuth2Session(
          OAuthProvider.Google, // Fixed Enum error
          `${window.location.origin}/callback`,
          `${window.location.origin}/callback?error=1`
        );
      },

      async loadOAuthSession() {
        try {
          const session = await account.getSession("current");

          const [user, { jwt }] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT(),
          ]);

          if (!user.prefs?.reputation) {
            await account.updatePrefs<UserPrefs>({ reputation: 0 });
          }

          set({ session, user, jwt });
          return true; // Return success
        } catch (error) {
          console.log("OAuth load error:", error);
          return false; // Return failure
        }
      },
    })),
    {
      name: "auth",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);
