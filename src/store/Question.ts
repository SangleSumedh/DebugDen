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
  authorName: string;
  tags: string[];
  attachmentId?: string;
  $createdAt: string;
}

interface QuestionState {
  questions: Question[];
  filteredQuestions: Question[];
  loading: boolean;
  error: string | null;
  searchQuery: string;

  fetchQuestions: () => Promise<void>;
  getQuestionById: (id: string) => Promise<Question | null>;
  addQuestion: (
    title: string,
    content: string,
    tags: string[],
    attachmentId?: string
  ) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  searchQuestions: (query: string) => void;
  clearSearch: () => void;
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
  filteredQuestions: [],
  loading: false,
  error: null,
  searchQuery: "",

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

      // Sort questions by creation date (newest first)
      const sortedQuestions = questions.sort(
        (a, b) =>
          new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
      );

      set({
        questions: sortedQuestions,
        filteredQuestions: sortedQuestions,
        loading: false,
      });
    } catch (err: unknown) {
      let message = "An unknown error occurred while fetching questions";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
    }
  },

  searchQuestions: (query: string) => {
    const { questions } = get();

    if (!query.trim()) {
      set({ filteredQuestions: questions, searchQuery: "" });
      return;
    }

    const lowercasedQuery = query.toLowerCase().trim();

    const filtered = questions.filter(
      (question) =>
        question.title.toLowerCase().includes(lowercasedQuery) ||
        question.content.toLowerCase().includes(lowercasedQuery) ||
        question.tags.some((tag) =>
          tag.toLowerCase().includes(lowercasedQuery)
        ) ||
        question.authorName.toLowerCase().includes(lowercasedQuery)
    );

    set({
      filteredQuestions: filtered,
      searchQuery: query,
    });
  },

  clearSearch: () => {
    const { questions } = get();
    set({
      filteredQuestions: questions,
      searchQuery: "",
    });
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

      const updatedQuestions = [newQuestion, ...get().questions]; // Add new question at the beginning

      // Sort to maintain order (though new question should already be first)
      const sortedQuestions = updatedQuestions.sort(
        (a, b) =>
          new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
      );

      set({
        questions: sortedQuestions,
        filteredQuestions: sortedQuestions,
      });
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
      const updatedQuestions = get().questions.filter((q) => q.$id !== id);
      set({
        questions: updatedQuestions,
        filteredQuestions: updatedQuestions,
      });
    } catch (err: unknown) {
      let message = "An unknown error while deleting question occurred";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
    }
  },
}));
