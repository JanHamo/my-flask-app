import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArticleSchema, SearchParams, NewsApiResponse, NewsApiArticle } from "@shared/schema";
import axios from "axios";
import { ZodError } from "zod";
import { spawn } from "child_process";

export async function registerRoutes(app: Express): Promise<Server> {
  // Start sentiment analysis server
  try {
    console.log("Starting sentiment analysis service...");
    const sentimentServer = spawn('python3', ['server/sentiment_api.py']);
    
    sentimentServer.stdout.on('data', (data) => {
      console.log(`Sentiment server: ${data}`);
    });
    
    sentimentServer.stderr.on('data', (data) => {
      console.error(`Sentiment server error: ${data}`);
    });
    
    sentimentServer.on('close', (code) => {
      console.log(`Sentiment server process exited with code ${code}`);
    });
    
    // Give it a moment to start
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.error("Failed to start sentiment analysis service:", error);
  }
  // Helper to handle API errors
  const handleError = (res: Response, error: unknown) => {
    console.error("API Error:", error);
    
    if (error instanceof ZodError) {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    
    return res.status(500).json({ message: "An unknown error occurred" });
  };

  // Fetch news from News API
  app.get("/api/news", async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.NEWS_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ message: "API key not configured" });
      }
      
      const params: SearchParams = {
        q: req.query.q as string || "gold",
        sortBy: (req.query.sortBy as 'publishedAt' | 'relevancy' | 'popularity') || 'publishedAt',
        language: req.query.language as string || 'en',
        pageSize: Number(req.query.pageSize) || 10,
        page: Number(req.query.page) || 1
      };
      
      if (req.query.sources) {
        params.sources = req.query.sources as string;
      }
      
      if (req.query.from) {
        params.from = req.query.from as string;
      }
      
      if (req.query.to) {
        params.to = req.query.to as string;
      }
      
      const url = "https://newsapi.org/v2/everything";
      
      const response = await axios.get<NewsApiResponse>(url, {
        params: {
          ...params,
          apiKey
        }
      });
      
      if (response.data.status !== "ok") {
        return res.status(400).json({ message: "Failed to fetch news", error: response.data });
      }
      
      // Map the API response to our schema and save to storage
      const articleData = response.data.articles.map((article: NewsApiArticle) => ({
        title: article.title,
        description: article.description || "",
        url: article.url,
        urlToImage: article.urlToImage || "",
        publishedAt: new Date(article.publishedAt),
        source: article.source.name,
        sourceId: article.source.id || "",
        category: determineCategoryFromTitle(article.title),
        content: article.content || "",
        author: article.author || "",
        sentiment: analyzeSentiment(article.title, article.description || "")
      }));
      
      // Save articles to storage
      const validatedArticles = articleData.map(article => insertArticleSchema.parse(article));
      const savedArticles = await storage.saveArticles(validatedArticles);
      
      return res.json({
        status: response.data.status,
        totalResults: response.data.totalResults,
        articles: savedArticles
      });
    } catch (error) {
      return handleError(res, error);
    }
  });

  // Search articles in storage
  app.get("/api/articles/search", async (req: Request, res: Response) => {
    try {
      const searchTerm = req.query.q as string;
      const limit = Number(req.query.limit) || 20;
      const offset = Number(req.query.offset) || 0;
      
      if (!searchTerm) {
        return res.status(400).json({ message: "Search term is required" });
      }
      
      const articles = await storage.searchArticles(searchTerm, limit, offset);
      return res.json({ articles });
    } catch (error) {
      return handleError(res, error);
    }
  });

  // Get articles by category
  app.get("/api/articles/category/:category", async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const limit = Number(req.query.limit) || 20;
      const offset = Number(req.query.offset) || 0;
      
      const articles = await storage.getArticlesByCategory(category, limit, offset);
      return res.json({ articles });
    } catch (error) {
      return handleError(res, error);
    }
  });

  // Get all articles
  app.get("/api/articles", async (req: Request, res: Response) => {
    try {
      const limit = Number(req.query.limit) || 20;
      const offset = Number(req.query.offset) || 0;
      
      const articles = await storage.getArticles(limit, offset);
      return res.json({ articles });
    } catch (error) {
      return handleError(res, error);
    }
  });

  // Get article by ID
  app.get("/api/articles/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid article ID" });
      }
      
      const article = await storage.getArticleById(id);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      return res.json(article);
    } catch (error) {
      return handleError(res, error);
    }
  });

  // Add article to favorites
  app.post("/api/favorites", async (req: Request, res: Response) => {
    try {
      const { userId, articleId } = req.body;
      
      if (!userId || !articleId) {
        return res.status(400).json({ message: "User ID and Article ID are required" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const article = await storage.getArticleById(articleId);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      const isFavorite = await storage.isFavorite(userId, articleId);
      
      if (isFavorite) {
        return res.status(400).json({ message: "Article already in favorites" });
      }
      
      const favorite = await storage.addFavorite({ userId, articleId });
      return res.status(201).json(favorite);
    } catch (error) {
      return handleError(res, error);
    }
  });

  // Remove article from favorites
  app.delete("/api/favorites", async (req: Request, res: Response) => {
    try {
      const { userId, articleId } = req.body;
      
      if (!userId || !articleId) {
        return res.status(400).json({ message: "User ID and Article ID are required" });
      }
      
      const removed = await storage.removeFavorite(userId, articleId);
      
      if (!removed) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      
      return res.json({ success: true });
    } catch (error) {
      return handleError(res, error);
    }
  });

  // Get user favorites
  app.get("/api/favorites/:userId", async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const favorites = await storage.getFavorites(userId);
      return res.json({ favorites });
    } catch (error) {
      return handleError(res, error);
    }
  });

  // Check if article is favorited by user
  app.get("/api/favorites/check", async (req: Request, res: Response) => {
    try {
      const userId = Number(req.query.userId);
      const articleId = Number(req.query.articleId);
      
      if (isNaN(userId) || isNaN(articleId)) {
        return res.status(400).json({ message: "Invalid user ID or article ID" });
      }
      
      const isFavorite = await storage.isFavorite(userId, articleId);
      return res.json({ isFavorite });
    } catch (error) {
      return handleError(res, error);
    }
  });

  // Helper functions for categorization and sentiment analysis
  function determineCategoryFromTitle(title: string): string {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes("market") || lowerTitle.includes("price") || lowerTitle.includes("trading")) {
      return "Markets";
    } else if (lowerTitle.includes("invest") || lowerTitle.includes("portfolio") || lowerTitle.includes("etf")) {
      return "Investment";
    } else if (lowerTitle.includes("central bank") || lowerTitle.includes("fed") || lowerTitle.includes("reserve")) {
      return "Central Banks";
    } else if (lowerTitle.includes("mine") || lowerTitle.includes("production") || lowerTitle.includes("output")) {
      return "Mining";
    } else if (lowerTitle.includes("economy") || lowerTitle.includes("economic")) {
      return "Economy";
    } else if (lowerTitle.includes("analysis") || lowerTitle.includes("opinion") || lowerTitle.includes("outlook")) {
      return "Analysis & Opinion";
    } else {
      return "General";
    }
  }

  async function analyzeSentiment(title: string, description: string): Promise<string> {
    try {
      // Combine title and description for analysis
      const combinedText = title + " " + description;
      
      // Use the simple keyword-based approach as a fallback
      const simpleSentimentAnalysis = () => {
        const text = combinedText.toLowerCase();
        const positiveTerms = ["surge", "rise", "gain", "rally", "boost", "positive", "bullish", "soar", "jump", "climb", "growth", "recovery", "uptrend"];
        const negativeTerms = ["drop", "fall", "decline", "crash", "bearish", "negative", "plunge", "slump", "tumble", "dip", "decrease", "downtrend", "fear"];
        
        let positiveScore = 0;
        let negativeScore = 0;
        
        for (const term of positiveTerms) {
          if (text.includes(term)) {
            positiveScore++;
          }
        }
        
        for (const term of negativeTerms) {
          if (text.includes(term)) {
            negativeScore++;
          }
        }
        
        if (positiveScore > negativeScore) {
          return "positive";
        } else if (negativeScore > positiveScore) {
          return "negative";
        } else {
          return "neutral";
        }
      };
      
      // Try to use our sentiment analysis service
      try {
        // Call the sentiment analysis API
        const sentimentResponse = await axios.post('http://localhost:8001', {
          text: combinedText
        });
        
        // Return the classification
        if (sentimentResponse.data && sentimentResponse.data.classification) {
          return sentimentResponse.data.classification;
        } else {
          return simpleSentimentAnalysis();
        }
      } catch (error) {
        console.error("Error using sentiment analysis service:", error);
        
        // Fall back to using direct Python script execution
        try {
          const { execSync } = require('child_process');
          
          // Escape the text to prevent command injection
          const escapedText = combinedText.replace(/"/g, '\\"');
          
          // Call the Python script with the text
          const result = execSync(`python3 server/sentiment.py "${escapedText}"`).toString();
          const sentimentData = JSON.parse(result);
          
          // Return the classification
          if (sentimentData && sentimentData.classification) {
            return sentimentData.classification;
          } else {
            return simpleSentimentAnalysis();
          }
        } catch (pythonError) {
          console.error("Error using Python sentiment analysis:", pythonError);
          return simpleSentimentAnalysis();
        }
      }
    } catch (error) {
      console.error("Error in sentiment analysis:", error);
      return "neutral";
    }
  }

  const httpServer = createServer(app);
  return httpServer;
}
