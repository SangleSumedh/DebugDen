import type { Models } from "appwrite";

declare module "appwrite" {
  namespace Models {
    interface AnswerDocument extends Document {
      content: string;
      authorId: string;
      questionId: string;
    }
  }
}
