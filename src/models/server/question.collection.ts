import { TablesDBIndexType, Permission, OrderBy } from "node-appwrite";

import { db, questionCollection } from "../name";
import { databases } from "./config";

export default async function createQuestionCollection() {
  //create collection
  await databases.createTable(db, questionCollection, questionCollection, [
    Permission.read("any"),
    Permission.read("users"),
    Permission.create("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);

  console.log("Question Collection is Created");

  //creating attributes & indexes

  await Promise.all([
    databases.createStringColumn(db, questionCollection, "title", 100, true),
    databases.createStringColumn(
      db,
      questionCollection,
      "content",
      10000,
      true
    ),
    databases.createStringColumn(
      db,
      questionCollection,
      "authorId",
      50,
      true
    ),
    databases.createStringColumn(
      db,
      questionCollection,
      "authorName",
      50,
      false
    ),
    databases.createStringColumn(
      db,
      questionCollection,
      "tags",
      50,
      true,
      undefined,
      true
    ),
    databases.createStringColumn(
      db,
      questionCollection,
      "attachmentId",
      50,
      false
    ),
  ]);

  console.log("Question Attributes created");

  //create Indexes

  await Promise.all([
    databases.createIndex(
      db,
      questionCollection,
      "title",
      TablesDBIndexType.Fulltext,
      ["title"],
      [OrderBy.Asc]
    ),
    databases.createIndex(
      db,
      questionCollection,
      "content",
      TablesDBIndexType.Fulltext,
      ["content"],
      [OrderBy.Asc]
    ),
  ]);
}
