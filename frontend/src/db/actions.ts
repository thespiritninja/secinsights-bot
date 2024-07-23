"use server";
import { revalidatePath } from "next/cache";
import { database } from "./databse";
import { test, conversation } from "./schema";
import { eq } from "drizzle-orm";
export async function createTestEntry() {
  await database.insert(test).values({});
  revalidatePath("/");
}

export async function createQuestionDBEntry(
  questionData: dbConversationStruct
) {
  const response = await database
    .insert(conversation)
    .values(questionData)
    .returning({ q_id: conversation.q_id });
  revalidatePath("/");
  return response[0];
}

export async function updateQuestionDBEntry(
  questionData: dbConversationStruct
) {
  console.log(questionData);
  const response = await database
    .update(conversation)
    .set(questionData)
    .where(eq(questionData.q_id, conversation.q_id))
    .returning({ q_id: conversation.q_id });
  revalidatePath("/");
  return response[0];
}
