import { create } from "zustand";
import { ID } from "appwrite";
import { databases } from "@/models/client/config";
import { db, questionCollection } from "@/models/name";
import { useAuthStore } from "./Auth";
import { Models } from "appwrite";

interface Question {
  $id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  tags: string[];
  attachmentId?: string;
  $createdAt: string; 
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

interface QuestionDocument {
  $id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  tags?: string[];
  attachmentId?: string;
  $createdAt: string;
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  questions: [],
  loading: false,
  error: null,

  fetchQuestions: async () => {
    set({ loading: true, error: null });
    try {
      const res = await databases.listDocuments(db, questionCollection);

      const questions: Question[] = res.documents.map((doc: unknown) => {
        if (typeof doc === "object" && doc !== null) {
          const d = doc as Partial<QuestionDocument>;
          return {
            $id: d.$id ?? "",
            title: d.title ?? "",
            content: d.content ?? "",
            authorId: d.authorId ?? "",
            authorName: d.authorName ?? "",
            tags: d.tags ?? [],
            attachmentId: d.attachmentId,
            $createdAt: d.$createdAt ?? new Date().toISOString(),
          };
        }
        // fallback if doc isn't an object
        return {
          $id: "",
          title: "",
          content: "",
          authorId: "",
          authorName: "",
          tags: [],
          attachmentId: undefined,
          $createdAt: new Date().toISOString(),
        };
      });

      set({ questions, loading: false });
    } catch (err: unknown) {
      let message = "An unknown error occurred while creating question document";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
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
        authorName: doc.authorName,
        tags: doc.tags ?? [],
        attachmentId: doc.attachmentId,
        $createdAt: doc.$createdAt, 
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
          authorName: user.name,
        }
      );

      const newQuestion: Question = {
        $id: newDoc.$id,
        title: newDoc.title,
        content: newDoc.content,
        authorId: newDoc.authorId,
        authorName: newDoc.authorName,
        tags: newDoc.tags ?? [],
        attachmentId: newDoc.attachmentId,
        $createdAt: newDoc.$createdAt, 
      };

      set({ questions: [...get().questions, newQuestion] });
    } catch (err: unknown) {
      let message = "An unknown error occurred while creating question";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
    }

  },

  deleteQuestion: async (id) => {
    try {
      await databases.deleteDocument(db, questionCollection, id);
      set({ questions: get().questions.filter((q) => q.$id !== id) });
    } catch (err: unknown) {
      let message = "An unknown error while deleting question occurred";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
    }

  },
}));
