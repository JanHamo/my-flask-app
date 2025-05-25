import { 
  articles, favorites, users, 
  type Article, type InsertArticle, 
  type Favorite, type InsertFavorite,
  type User, type InsertUser
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Articles
  getArticles(limit?: number, offset?: number): Promise<Article[]>;
  getArticleById(id: number): Promise<Article | undefined>;
  getArticlesByCategory(category: string, limit?: number, offset?: number): Promise<Article[]>;
  saveArticle(article: InsertArticle): Promise<Article>;
  saveArticles(articles: InsertArticle[]): Promise<Article[]>;
  searchArticles(searchTerm: string, limit?: number, offset?: number): Promise<Article[]>;
  
  // Favorites
  getFavorites(userId: number): Promise<Article[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, articleId: number): Promise<boolean>;
  isFavorite(userId: number, articleId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private articlesMap: Map<number, Article>;
  private favoritesMap: Map<number, Favorite>;
  private currentUserId: number;
  private currentArticleId: number;
  private currentFavoriteId: number;

  constructor() {
    this.users = new Map();
    this.articlesMap = new Map();
    this.favoritesMap = new Map();
    this.currentUserId = 1;
    this.currentArticleId = 1;
    this.currentFavoriteId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Article methods
  async getArticles(limit = 20, offset = 0): Promise<Article[]> {
    return Array.from(this.articlesMap.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(offset, offset + limit);
  }

  async getArticleById(id: number): Promise<Article | undefined> {
    return this.articlesMap.get(id);
  }

  async getArticlesByCategory(category: string, limit = 20, offset = 0): Promise<Article[]> {
    return Array.from(this.articlesMap.values())
      .filter(article => article.category === category)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(offset, offset + limit);
  }

  async saveArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentArticleId++;
    const article: Article = { ...insertArticle, id };
    this.articlesMap.set(id, article);
    return article;
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
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return Array.from(this.articlesMap.values())
      .filter(article => 
        article.title.toLowerCase().includes(lowerSearchTerm) || 
        (article.description && article.description.toLowerCase().includes(lowerSearchTerm)) ||
        (article.content && article.content.toLowerCase().includes(lowerSearchTerm))
      )
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(offset, offset + limit);
  }

  // Favorites methods
  async getFavorites(userId: number): Promise<Article[]> {
    const userFavorites = Array.from(this.favoritesMap.values())
      .filter(favorite => favorite.userId === userId);
    
    return userFavorites.map(favorite => 
      this.articlesMap.get(favorite.articleId)!
    ).filter(Boolean);
  }

  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = this.currentFavoriteId++;
    const favorite: Favorite = { 
      ...insertFavorite, 
      id, 
      savedAt: new Date() 
    };
    
    this.favoritesMap.set(id, favorite);
    return favorite;
  }

  async removeFavorite(userId: number, articleId: number): Promise<boolean> {
    const favoriteToRemove = Array.from(this.favoritesMap.values())
      .find(fav => fav.userId === userId && fav.articleId === articleId);
    
    if (favoriteToRemove) {
      this.favoritesMap.delete(favoriteToRemove.id);
      return true;
    }
    
    return false;
  }

  async isFavorite(userId: number, articleId: number): Promise<boolean> {
    return Array.from(this.favoritesMap.values())
      .some(fav => fav.userId === userId && fav.articleId === articleId);
  }
}

export const storage = new MemStorage();
