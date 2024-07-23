import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const test = pgTable("test", {
  id: serial("id").primaryKey(),
});

export const conversation = pgTable("conversation", {
  q_id: text("q_id").primaryKey(),
  question: text("question").notNull(),
  model_answer: text("model_answer").notNull(),
  model_context: jsonb("model_context").notNull(),
  is_annotated: boolean("is_annotated"),
  annotated_answer: text("annotated_answer"),
  annotated_context: jsonb("annotated_context"),
  created_at: date("created_at").notNull().defaultNow(),
  updated_at: date("updated_at").notNull().defaultNow(),
  // conversation_id: integer("conversation_id").references("conversation.id").onDelete("CASCADE"),
});
