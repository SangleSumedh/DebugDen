import { create } from "zustand";
import { ID } from "appwrite";
import { databases } from "@/models/client/config";
import { db, questionCollection } from "@/models/name";
import { useAuthStore } from "./Auth";

interface Question {
  $id: string;
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  attachmentId?: string;
  $createdAt: string; // ✅ use Appwrite system field
}

interface QuestionState {
  questions: Question[];
  loading: boolean;
  error: string | null;

  fetchQuestions: () => Promise<void>;
  getQuestionById: (id: string) => Promise<Question | null>;
  addQuestion: (
    title: string,
    content: string,
    tags: string[],
    attachmentId?: string
  ) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  questions: [],
  loading: false,
  error: null,

  fetchQuestions: async () => {
    set({ loading: true, error: null });
    try {
      const res = await databases.listDocuments(db, questionCollection);

      const questions: Question[] = res.documents.map((doc: any) => ({
        $id: doc.$id,
        title: doc.title,
        content: doc.content,
        authorId: doc.authorId,
        tags: doc.tags ?? [],
        attachmentId: doc.attachmentId,
        $createdAt: doc.$createdAt, // ✅ system timestamp
      }));

      set({ questions, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  getQuestionById: async (id) => {
    try {
      const doc = await databases.getDocument(db, questionCollection, id);

      const question: Question = {
        $id: doc.$id,
        title: doc.title,
        content: doc.content,
        authorId: doc.authorId,
        tags: doc.tags ?? [],
        attachmentId: doc.attachmentId,
        $createdAt: doc.$createdAt, // ✅
      };

      return question;
    } catch {
      return null;
    }
  },

  addQuestion: async (title, content, tags, attachmentId) => {
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error("Not Authenticated");

      const newDoc = await databases.createDocument(
        db,
        questionCollection,
        ID.unique(),
        {
          title,
          content,
          tags,
          attachmentId,
          authorId: user.$id,
        }
      );

      const newQuestion: Question = {
        $id: newDoc.$id,
        title: newDoc.title,
        content: newDoc.content,
        authorId: newDoc.authorId,
        tags: newDoc.tags ?? [],
        attachmentId: newDoc.attachmentId,
        $createdAt: newDoc.$createdAt, // ✅ Appwrite gives this automatically
      };

      set({ questions: [...get().questions, newQuestion] });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  deleteQuestion: async (id) => {
    try {
      await databases.deleteDocument(db, questionCollection, id);
      set({ questions: get().questions.filter((q) => q.$id !== id) });
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
