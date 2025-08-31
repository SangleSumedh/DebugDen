import { create } from "zustand";
import { databases } from "@/models/client/config";
import { db, commentCollection } from "@/models/name";
import { ID, Query, Models } from "appwrite";
import { useAuthStore } from "./Auth";


export enum CommentParentType {
  Answer = "answer",
  Question = "question",
}

interface Comment {
  $id: string;
  content: string;
  type: CommentParentType;
  typeId: string;
  authorId: string;
  authorName: string;
  $createdAt: string;
}

interface CommentDocument extends Models.Document {
  content: string;
  type: CommentParentType;
  typeId: string;
  authorId: string;
  authorName: string;
}

interface CommentStore {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  fetchComments: (
    parentType: CommentParentType,
    parentId: string
  ) => Promise<void>;
  addComment: (
    content: string,
    parentType: CommentParentType,
    parentId: string
  ) => Promise<void>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
}

export const useCommentStore = create<CommentStore>((set, get) => ({
  comments: [],
  loading: false,
  error: null,

  fetchComments: async (parentType, parentId) => {
    set({ loading: true, error: null });
    try {
      const res = await databases.listDocuments(db, commentCollection, [
        Query.equal("type", parentType),
        Query.equal("typeId", parentId),
        Query.orderAsc("$createdAt"),
      ]);

      const mapped: Comment[] = res.documents.map((doc) => {
        const commentDoc = doc as unknown as CommentDocument;
        return {
          $id: commentDoc.$id,
          content: commentDoc.content,
          type: commentDoc.type,
          typeId: commentDoc.typeId,
          authorId: commentDoc.authorId,
          authorName: commentDoc.authorName,
          $createdAt: commentDoc.$createdAt,
        };
      });

      set({ comments: mapped, loading: false });
    } catch (err: unknown) {
      let message = "Failed to fetch comments";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
    }
  },

  addComment: async (content, parentType, parentId) => {
    set({ loading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error("Not Authenticated");

      const newDoc = await databases.createDocument(
        db,
        commentCollection,
        ID.unique(),
        {
          content,
          type: parentType,
          typeId: parentId,
          authorId: user.$id,
          authorName: user.name,
        }
      );

      const newComment: Comment = {
        $id: newDoc.$id,
        content: newDoc.content,
        type: newDoc.type as CommentParentType,
        typeId: newDoc.typeId,
        authorId: newDoc.authorId,
        authorName: newDoc.authorName,
        $createdAt: newDoc.$createdAt,
      };

      set({ comments: [...get().comments, newComment], loading: false });
    } catch (err: unknown) {
      let message = "Failed to add comment";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
    }
  },

  updateComment: async (commentId, content) => {
    set({ loading: true, error: null });
    try {
      const updatedDoc = await databases.updateDocument(
        db,
        commentCollection,
        commentId,
        { content }
      );

      set((state) => ({
        comments: state.comments.map((comment) =>
          comment.$id === commentId ? { ...comment, content } : comment
        ),
        loading: false,
      }));
    } catch (err: unknown) {
      let message = "Failed to update comment";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
    }
  },

  deleteComment: async (commentId) => {
    set({ loading: true, error: null });
    try {
      await databases.deleteDocument(db, commentCollection, commentId);

      set((state) => ({
        comments: state.comments.filter((comment) => comment.$id !== commentId),
        loading: false,
      }));
    } catch (err: unknown) {
      let message = "Failed to delete comment";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
    }
  },
}));
