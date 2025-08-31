import { create } from "zustand";
import { databases } from "@/models/client/config";
import { db, answerCollection } from "@/models/name";
import { ID, Query } from "appwrite";
import { useAuthStore } from "./Auth";

interface Answer {
  $id: string;
  content: string;
  authorId: string;
  questionId: string;
  $createdAt: string;
}

interface AnswerStore {
  answers: Answer[];
  loading: boolean;
  error: string | null;
  fetchAnswers: (questionId: string) => Promise<void>;
  addAnswer: (questionId: string, content: string) => Promise<void>;
}

export const useAnswerStore = create<AnswerStore>((set, get) => ({
  answers: [],
  loading: false,
  error: null,

  fetchAnswers: async (questionId) => {
    set({ loading: true, error: null });
    try {
      const res = await databases.listDocuments(db, answerCollection, [
        Query.equal("questionId", questionId),
        // optionally: Query.orderDesc("$createdAt")
      ]);

      const mapped = res.documents.map((doc: any) => ({
        $id: doc.$id,
        content: doc.content,
        authorId: doc.authorId,
        questionId: doc.questionId,
        $createdAt: doc.$createdAt,
      })) as Answer[];

      set({ answers: mapped, loading: false });
    } catch (err: any) {
      set({ error: err?.message ?? "Failed to fetch answers", loading: false });
    }
  },

  addAnswer: async (questionId, content) => {
    set({ loading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error("Not Authenticated");

      const newDoc = await databases.createDocument(
        db,
        answerCollection,
        ID.unique(),
        {
          content,
          questionId,
          authorId: user.$id,
        }
      );

      const newAnswer: Answer = {
        $id: newDoc.$id,
        content: newDoc.content,
        authorId: newDoc.authorId,
        questionId: newDoc.questionId,
        $createdAt: newDoc.$createdAt,
      };

      set({ answers: [...get().answers, newAnswer], loading: false });
    } catch (err: any) {
      set({ error: err?.message ?? "Failed to add answer", loading: false });
    }
  },
}));
