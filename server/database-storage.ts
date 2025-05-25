import { 
  articles, favorites, users, 
  type Article, type InsertArticle, 
  type Favorite, type InsertFavorite,
  type User, type InsertUser
} from "@shared/schema";
import { IStorage } from "./storage";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Article methods
  async getArticles(limit = 20, offset = 0): Promise<Article[]> {
    return await db
      .select()
      .from(articles)
      .orderBy(articles.publishedAt)
      .limit(limit)
      .offset(offset);
  }

  async getArticleById(id: number): Promise<Article | undefined> {
    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, id));
    return article || undefined;
  }

  async getArticlesByCategory(category: string, limit = 20, offset = 0): Promise<Article[]> {
    return await db
      .select()
      .from(articles)
      .where(eq(articles.category, category))
      .orderBy(articles.publishedAt)
      .limit(limit)
      .offset(offset);
  }

  async saveArticle(insertArticle: InsertArticle): Promise<Article> {
    // Check if article with the same URL already exists
    const [existingArticle] = await db
      .select()
      .from(articles)
      .where(eq(articles.url, insertArticle.url));
    
    if (existingArticle) {
      // Update the existing article
      const [updatedArticle] = await db
        .update(articles)
        .set(insertArticle)
        .where(eq(articles.id, existingArticle.id))
        .returning();
      return updatedArticle;
    } else {
      // Insert new article
      const [article] = await db
        .insert(articles)
        .values(insertArticle)
        .returning();
      return article;
    }
  }

  async saveArticles(insertArticles: InsertArticle[]): Promise<Article[]> {
    const savedArticles: Article[] = [];
    
    for (const insertArticle of insertArticles) {
      const savedArticle = await this.saveArticle(insertArticle);
      savedArticles.push(savedArticle);
    }
    
    return savedArticles;
  }

  async searchArticles(searchTerm: string, limit = 20, offset = 0): Promise<Article[]> {
    // Simple text search using ILIKE
    const lowerSearchTerm = `%${searchTerm.toLowerCase()}%`;
    
    return await db
      .select()
      .from(articles)
      .where(
        or(
          ilike(articles.title, lowerSearchTerm),
          ilike(articles.description, lowerSearchTerm),
          ilike(articles.content, lowerSearchTerm)
        )
      )
      .orderBy(articles.publishedAt)
      .limit(limit)
      .offset(offset);
  }

  // Favorites methods
  async getFavorites(userId: number): Promise<Article[]> {
    // Join favorites with articles to get the full article data
    const result = await db
      .select({
        article: articles
      })
      .from(favorites)
      .innerJoin(articles, eq(favorites.articleId, articles.id))
      .where(eq(favorites.userId, userId));
    
    return result.map(r => r.article);
  }

  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const [favorite] = await db
      .insert(favorites)
      .values(insertFavorite)
      .returning();
    
    return favorite;
  }

  async removeFavorite(userId: number, articleId: number): Promise<boolean> {
    const result = await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.articleId, articleId)
        )
      );
    
    // For Drizzle with PostgreSQL, returning the success based on operation completion
    return true;
  }

  async isFavorite(userId: number, articleId: number): Promise<boolean> {
    const [favorite] = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.articleId, articleId)
        )
      );
    
    return !!favorite;
  }
}

// Helper functions
function or(...conditions: any[]) {
  return sql`${sql.join(conditions, sql` OR `)}`;
}

function ilike(column: any, value: string) {
  return sql`${column} ILIKE ${value}`;
}