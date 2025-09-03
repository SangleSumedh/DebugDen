import { NextRequest, NextResponse } from "next/server";
import { Client, Databases, ID } from "node-appwrite";
import env from "@/app/env"; // make sure your env has OPENROUTER_API_KEY + APPWRITE creds
import { db, answerCollection } from "@/models/name";

interface AIAnswerRequest {
  questionId: string;
  questionContent: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AIAnswerRequest = await request.json();
    const { questionId, questionContent } = body;

    if (!questionId || !questionContent) {
      return NextResponse.json(
        { error: "Missing questionId or content" },
        { status: 400 }
      );
    }

    // 🔑 Call OpenRouter API (GPT-3.5 or whichever you configured)
    const aiResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.appwrite.gptApiKey!}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an AI assistant. Always start your answer with 'Created by AI:' and give a clear, concise answer.",
            },
            { role: "user", content: questionContent },
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      }
    );

    if (!aiResponse.ok) {
      const errorData = await aiResponse.text();
      console.error("OpenRouter API error:", errorData);
      return NextResponse.json({ error: errorData }, { status: 500 });
    }

    const data = await aiResponse.json();
    const aiAnswerText =
      data?.choices?.[0]?.message?.content ||
      "AI could not generate an answer.";

    // 🔑 Setup Appwrite server client
    const client = new Client()
      .setEndpoint(env.appwrite.endpoint!)
      .setProject(env.appwrite.projectId!)
      .setKey(env.appwrite.apikey!); // server-side key

    const databases = new Databases(client);

    // Save AI answer into Appwrite
    const aiAnswerDoc = await databases.createDocument(
      db, // database ID
      answerCollection, // collection ID
      ID.unique(),
      {
        content: aiAnswerText,
        questionId,
        authorId: "AI",
        authorName: "AI Bot",

      }
    );

    console.log("AI Answer created:", aiAnswerDoc.$id);

    return NextResponse.json({ success: true, answer: aiAnswerDoc });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Unknown error occurred while generating AI answer";
    console.error("Error in AI generation:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
