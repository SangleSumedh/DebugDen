import { Permission } from "node-appwrite";
import { db, answerCollection } from "../name";
import { databases } from "./config";

export default async function createAnswerCollection() {
  await databases.createTable(db, answerCollection, answerCollection, [
    Permission.create("users"),
    Permission.read("any"),
    Permission.read("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);

  console.log("Answer Collection Created");

  //create attributes

  await Promise.all([
    databases.createStringColumn(
      db,
      answerCollection,
      "content",
      10000,
      true
    ),
    databases.createStringColumn(
      db,
      answerCollection,
      "questionId",
      50,
      true
    ),
    databases.createStringColumn(db, answerCollection, "authorId", 50, true),
    databases.createStringColumn(
      db,
      answerCollection,
      "authorName",
      50,
      false
    ),
  ]);

  console.log("Answer Attributes created");

  console.log("come here")
  //create Indexes
}
