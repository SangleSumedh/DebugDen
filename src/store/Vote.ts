"use client";

import { create } from "zustand";
import { databases } from "@/models/client/config";
import {
  db,
  questionCollection,
  answerCollection,
  voteCollection,
} from "@/models/name";
import { ID, Query } from "appwrite";
import { useAuthStore } from "./Auth";

interface VoteCounts {
  upvotes: number;
  downvotes: number;
  score: number;
}

interface VoteStore {
  votes: Record<string, string | null>; // key: `${type}-${typeId}-${userId}` => "upvoted" | "downvoted"
  loading: boolean;
  error: string | null;
  voteCounts: Record<string, VoteCounts>; // key: `${type}-${typeId}`

  fetchVotes: (type: "question" | "answer", typeId: string) => Promise<void>;
  castVote: (
    type: "question" | "answer",
    typeId: string,
    voteStatus: "upvoted" | "downvoted"
  ) => Promise<void>;
}

export const useVoteStore = create<VoteStore>((set, get) => ({
  votes: {},
  voteCounts: {},
  loading: false,
  error: null,

  fetchVotes: async (type, typeId) => {
    set({ loading: true, error: null });
    try {
      const [up, down] = await Promise.all([
        databases.listDocuments(db, voteCollection, [
          Query.equal("type", type),
          Query.equal("typeId", typeId),
          Query.equal("voteStatus", "upvoted"),
        ]),
        databases.listDocuments(db, voteCollection, [
          Query.equal("type", type),
          Query.equal("typeId", typeId),
          Query.equal("voteStatus", "downvoted"),
        ]),
      ]);

      set((state) => ({
        voteCounts: {
          ...state.voteCounts,
          [`${type}-${typeId}`]: {
            upvotes: up.total,
            downvotes: down.total,
            score: up.total - down.total,
          },
        },
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  castVote: async (type, typeId, voteStatus) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const key = `${type}-${typeId}-${user.$id}`;
    const currentVote = get().votes[key]; // existing vote
    const currentCounts = get().voteCounts[`${type}-${typeId}`] || {
      upvotes: 0,
      downvotes: 0,
      score: 0,
    };

    // 1️⃣ Optimistically update votes & counts
    let newCounts = { ...currentCounts };
    let newVote: string | null = voteStatus;

    if (!currentVote) {
      // No vote yet → add
      if (voteStatus === "upvoted") newCounts.upvotes += 1;
      else newCounts.downvotes += 1;
      newCounts.score = newCounts.upvotes - newCounts.downvotes;
    } else if (currentVote === voteStatus) {
      // Clicking same vote → remove
      newVote = null;
      if (voteStatus === "upvoted") newCounts.upvotes -= 1;
      else newCounts.downvotes -= 1;
      newCounts.score = newCounts.upvotes - newCounts.downvotes;
    } else {
      // Switching vote
      if (voteStatus === "upvoted") {
        newCounts.upvotes += 1;
        newCounts.downvotes -= 1;
      } else {
        newCounts.upvotes -= 1;
        newCounts.downvotes += 1;
      }
      newCounts.score = newCounts.upvotes - newCounts.downvotes;
    }

    // Apply optimistic state
    set((state) => ({
      votes: { ...state.votes, [key]: newVote },
      voteCounts: { ...state.voteCounts, [`${type}-${typeId}`]: newCounts },
    }));

    // 2️⃣ Make Appwrite request in background
    try {
      const existing = await databases.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("votedById", user.$id),
      ]);
      const currentVoteDoc = existing.documents[0] ?? null;

      // TODO: Add author reputation logic if needed
      if (!currentVoteDoc) {
        await databases.createDocument(db, voteCollection, ID.unique(), {
          type,
          typeId,
          voteStatus,
          votedById: user.$id,
        });
      } else if (currentVoteDoc.voteStatus === voteStatus) {
        await databases.deleteDocument(db, voteCollection, currentVoteDoc.$id);
      } else {
        await databases.updateDocument(db, voteCollection, currentVoteDoc.$id, {
          voteStatus,
        });
      }

      // Optionally, re-fetch counts from Appwrite to be 100% accurate
      await get().fetchVotes(type, typeId);
    } catch (err: any) {
      console.error("Vote failed:", err);

      // Revert UI if Appwrite fails
      set((state) => ({
        votes: { ...state.votes, [key]: currentVote }, // revert to previous vote
        voteCounts: {
          ...state.voteCounts,
          [`${type}-${typeId}`]: currentCounts,
        }, // revert counts
        error: err.message,
      }));
    }
  },
}));
