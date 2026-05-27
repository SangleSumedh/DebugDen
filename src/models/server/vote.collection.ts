import { Permission } from "node-appwrite";
import { db, voteCollection } from "../name";
import { databases } from "./config";

export default async function createVoteCollection() {
  await databases.createTable(db, voteCollection, voteCollection, [
    Permission.create("users"),
    Permission.read("any"),
    Permission.read("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);

  console.log("Vote Collection Created");

  //create attributes

  await Promise.all([
    databases.createEnumColumn(
      db,
      voteCollection,
      "type",
      ["question", "answer"],
      true
    ),
    databases.createStringColumn(db, voteCollection, "typeId", 50, true),
    databases.createEnumColumn(
      db,
      voteCollection,
      "voteStatus",
      ["upvoted", "downvoted"],
      true
    ),
    databases.createStringColumn(db, voteCollection, "votedById", 50, true),
  ]);

  console.log("Vote Attributes created");

  //create Indexes
}
