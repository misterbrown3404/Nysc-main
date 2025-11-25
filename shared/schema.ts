import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  state: text("state").notNull(),
  platoon: text("platoon").notNull(),
  totalHypePoints: integer("total_hype_points").notNull().default(0),
});

export const challenges = pgTable("challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  emoji: text("emoji").notNull(),
  participantCount: integer("participant_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  challengeId: varchar("challenge_id").notNull(),
  userId: varchar("user_id").notNull(),
  username: text("username").notNull(),
  state: text("state").notNull(),
  platoon: text("platoon").notNull(),
  caption: text("caption").notNull(),
  mediaType: text("media_type").notNull(), // 'image' or 'video'
  mediaUrl: text("media_url").notNull(),
  hypeCount: integer("hype_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const hypes = pgTable("hypes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  submissionId: varchar("submission_id").notNull(),
  userId: varchar("user_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  totalHypePoints: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  participantCount: true,
  createdAt: true,
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  hypeCount: true,
  createdAt: true,
});

export const insertHypeSchema = createInsertSchema(hypes).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;

export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;

export type Hype = typeof hypes.$inferSelect;
export type InsertHype = z.infer<typeof insertHypeSchema>;
