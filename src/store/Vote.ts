"use client";

import { create } from "zustand";
import { databases } from "@/models/client/config";
import { db, voteCollection } from "@/models/name";
import { ID, Query } from "appwrite";
import { useAuthStore } from "./Auth";
import { Models } from "appwrite";

interface Vote {
  $id: string;
  type: "question" | "answer";
  typeId: string;
  votedById: string;
  voteStatus: "upvoted" | "downvoted";
}

interface VoteStore {
  votes: Record<string, Vote>; // key: `${type}-${typeId}-${votedById}`
  loading: boolean;
  error: string | null;
  fetchVotes: (type: "question" | "answer", typeId: string) => Promise<void>;
  castVote: (
    type: "question" | "answer",
    typeId: string,
    voteStatus: "upvoted" | "downvoted"
  ) => Promise<void>;
}

interface VoteDocument extends Models.Document {
  type: "question" | "answer";
  typeId: string;
  votedById: string;
  voteStatus: "upvoted" | "downvoted";
}

export const useVoteStore = create<VoteStore>((set, get) => ({
  votes: {},
  loading: false,
  error: null,

  fetchVotes: async (type, typeId) => {
    set({ loading: true, error: null });
    try {
      const res = await databases.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
      ]);

      const mapped: Record<string, Vote> = {};
      res.documents.forEach((doc) => {
        const voteDoc = doc as unknown as VoteDocument;
        const key = `${voteDoc.type}-${voteDoc.typeId}-${voteDoc.votedById}`;
        mapped[key] = {
          $id: voteDoc.$id,
          type: voteDoc.type,
          typeId: voteDoc.typeId,
          votedById: voteDoc.votedById,
          voteStatus: voteDoc.voteStatus,
        };
      });

      set((state) => ({
        votes: { ...state.votes, ...mapped },
        loading: false,
      }));
    } catch (err: unknown) {
      let message = "Failed to fetch votes";
      if (err instanceof Error) message = err.message;
      set({ error: message, loading: false });
    }
  },

  castVote: async (type, typeId, voteStatus) => {
    set({ loading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error("Not Authenticated");

      // Call your vote API route instead of direct DB mutation
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          typeId,
          voteStatus,
          votedById: user.$id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Vote failed");

      // Store the latest vote in Zustand
      const key = `${type}-${typeId}-${user.$id}`;
      set((state) => ({
        votes: {
          ...state.votes,
          [key]: {
            $id: key, // local synthetic id
            type,
            typeId,
            votedById: user.$id,
            voteStatus,
          },
        },
        loading: false,
      }));
    } catch (err: unknown) {
      let message = "Failed to cast vote";
      if (err instanceof Error) message = err.message;
      set({ error: message, loading: false });
    }
  },
}));
