import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BookmarkX } from "lucide-react";

export default function Favorites() {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error("Error parsing favorites:", error);
      }
    }
  }, []);
  
  // Fetch all articles
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/news'],
    enabled: true,
  });
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleToggleFavorite = (article: Article, isFavorited: boolean) => {
    if (!isFavorited) {
      // Remove from favorites
      setFavorites(prev => {
        const newFavorites = prev.filter(id => id !== article.id);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        return newFavorites;
      });
      
      toast({
        title: "Removed from favorites",
        description: "Article removed from your favorites list",
      });
    }
  };
  
  // Filter articles that are in favorites
  const favoriteArticles = data?.articles?.filter(article => 
    favorites.includes(article.id)
  ) || [];
  
  // Filter by search query if provided
  const filteredArticles = searchQuery 
    ? favoriteArticles.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.description && article.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : favoriteArticles;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-navy-default/95 text-gray-800 dark:text-gray-200">
      <Header onSearch={handleSearch} />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 text-navy-default dark:text-white">Your Favorite Articles</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {favoriteArticles.length} {favoriteArticles.length === 1 ? 'article' : 'articles'} saved to your favorites
          </p>
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">Loading your favorites...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 dark:text-red-400 mb-2">Error loading favorites</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard 
                key={article.id}
                article={article}
                isFavorite={true}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 flex flex-col items-center">
            <BookmarkX className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">No favorites yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
              {searchQuery 
                ? "No favorites match your search query" 
                : "Save articles to your favorites for easy access later"}
            </p>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="bg-white dark:bg-transparent border border-gold text-gold hover:bg-gold/10"
            >
              Browse Articles
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
