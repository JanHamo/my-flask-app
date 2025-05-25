import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  urlToImage: text("url_to_image"),
  publishedAt: timestamp("published_at").notNull(),
  source: text("source"),
  sourceId: text("source_id"),
  category: text("category"),
  content: text("content"),
  author: text("author"),
  sentiment: text("sentiment").default("neutral"),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  articleId: integer("article_id").references(() => articles.id),
  savedAt: timestamp("saved_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  savedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

export type NewsApiArticle = {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
};

export type NewsApiResponse = {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
};

export type SearchParams = {
  q: string;
  sources?: string;
  from?: string;
  to?: string;
  sortBy?: 'publishedAt' | 'relevancy' | 'popularity';
  language?: string;
  pageSize?: number;
  page?: number;
};
