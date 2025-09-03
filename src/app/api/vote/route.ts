import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

export async function POST(request: NextRequest) {
  const { votedById, voteStatus, type, typeId } = await request.json();

  // Find existing vote by this user
  const existing = await databases.listDocuments(db, voteCollection, [
    Query.equal("type", type),
    Query.equal("typeId", typeId),
    Query.equal("votedById", votedById),
  ]);

  const currentVote = existing.documents[0] ?? null;

  // Fetch the target (question/answer) + author
  const targetDoc = await databases.getDocument(
    db,
    type === "question" ? questionCollection : answerCollection,
    typeId
  );
  const authorPrefs = await users.getPrefs<UserPrefs>(targetDoc.authorId);

  // Helper: adjust reputation
  async function adjustRep(delta: number) {
    await users.updatePrefs<UserPrefs>(targetDoc.authorId, {
      reputation: Number(authorPrefs.reputation) + delta,
    });
  }

  if (!currentVote) {
    // No previous vote → create new
    await databases.createDocument(db, voteCollection, ID.unique(), {
      type,
      typeId,
      voteStatus,
      votedById,
    });
    await adjustRep(voteStatus === "upvoted" ? +1 : -1);
  } else if (currentVote.voteStatus === voteStatus) {
    // Same vote clicked again → remove
    await databases.deleteDocument(db, voteCollection, currentVote.$id);
    await adjustRep(voteStatus === "upvoted" ? -1 : +1);
  } else {
    // Switching vote → update
    await databases.updateDocument(db, voteCollection, currentVote.$id, {
      voteStatus,
    });
    await adjustRep(voteStatus === "upvoted" ? +2 : -2);
  }

  // Count all upvotes & downvotes
  const [upvotes, downvotes] = await Promise.all([
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

  return NextResponse.json({
    data: {
      upvotes: upvotes.total,
      downvotes: downvotes.total,
      score: upvotes.total - downvotes.total,
    },
  });
}

