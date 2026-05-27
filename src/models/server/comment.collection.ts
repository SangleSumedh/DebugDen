import { Permission } from "node-appwrite";
import { db, commentCollection } from "../name";
import { databases } from "./config";

export default async function createCommentCollection() {
  await databases.createTable(db, commentCollection, commentCollection, [
    Permission.create("users"),
    Permission.read("any"),
    Permission.read("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);

  console.log("Comment Collection Created");

  //create attributes

  await Promise.all([
    databases.createStringColumn(
      db,
      commentCollection,
      "content",
      10000,
      true
    ),
    databases.createEnumColumn(
      db,
      commentCollection,
      "type",
      ["answer", "question"],
      true
    ),
    databases.createStringColumn(db, commentCollection, "typeId", 50, true),
    databases.createStringColumn(
      db,
      commentCollection,
      "authorId",
      50,
      true
    ),
    databases.createStringColumn(
      db,
      commentCollection,
      "authorName",
      50,
      false
    ),
  ]);

  console.log("Comment Attributes created");

  //create Indexes
}
