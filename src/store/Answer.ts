import { create } from "zustand";
import { databases } from "@/models/client/config";
import { db, answerCollection } from "@/models/name";
import { ID, Query } from "appwrite";
import { useAuthStore } from "./Auth";
import { Models } from "appwrite";

interface Answer {
  $id: string;
  content: string;
  authorId: string;
  authorName: string;
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

interface AnswerDocument extends Models.Document {
  content: string;
  authorId: string;
  authorName: string;
  questionId: string;
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
        Query.orderDesc("$createdAt")
      ]);

      const mapped: Answer[] = res.documents.map((doc) => {
        const answerDoc = doc as unknown as AnswerDocument;
        return {
          $id: answerDoc.$id,
          content: answerDoc.content,
          authorId: answerDoc.authorId,
          authorName: answerDoc.authorName,
          questionId: answerDoc.questionId,
          $createdAt: answerDoc.$createdAt,
        };
      });

      set({ answers: mapped, loading: false });
    } catch (err: unknown) {
      let message = "Failed to fetch answers";

      if (err instanceof Error) {
        message = err.message;
      }

      set({ error: message, loading: false });
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
          authorName: user.name ,
        }
      );

      const newAnswer: Answer = {
        $id: newDoc.$id,
        content: newDoc.content,
        authorId: newDoc.authorId,
        authorName: newDoc.authorName,
        questionId: newDoc.questionId,
        $createdAt: newDoc.$createdAt,
      };

      set({ answers: [...get().answers, newAnswer], loading: false });
    } catch (err: unknown) {
      let message = "Failed to fetch answers";

      if (err instanceof Error) {
        message = err.message;
      }

      set({ error: message, loading: false });
    }
  },
}));
