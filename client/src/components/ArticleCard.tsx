import { useState } from "react";
import { Article } from "@shared/schema";
import { getTimeAgo, categoryToIcon, truncateText } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Share, BookmarkCheck, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  isFavorite?: boolean;
  onToggleFavorite?: (article: Article, isFavorited: boolean) => void;
}

export function ArticleCard({ 
  article, 
  isFavorite = false, 
  onToggleFavorite 
}: ArticleCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(isFavorite);
  const { toast } = useToast();
  
  const handleArticleClick = () => {
    window.open(article.url, "_blank", "noopener,noreferrer");
  };
  
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!onToggleFavorite) return;
    
    try {
      setIsLoading(true);
      // In a real app, this would interact with the backend
      // const userId = 1; // This would come from authentication
      // if (!isFavorited) {
      //   await apiRequest('POST', '/api/favorites', { userId, articleId: article.id });
      // } else {
      //   await apiRequest('DELETE', '/api/favorites', { userId, articleId: article.id });
      // }
      
      const newFavoritedState = !isFavorited;
      setIsFavorited(newFavoritedState);
      onToggleFavorite(article, newFavoritedState);
      
      toast({
        title: newFavoritedState 
          ? "Added to favorites" 
          : "Removed from favorites",
        description: newFavoritedState 
          ? "Article saved to your favorites list" 
          : "Article removed from your favorites list",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url,
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(article.url);
        toast({
          title: "Link copied",
          description: "Article link copied to clipboard",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  
  // Get the appropriate icon for the category
  const iconName = categoryToIcon(article.category || "");
  
  return (
    <div 
      className="bg-white dark:bg-navy-dark/80 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer"
      onClick={handleArticleClick}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className="inline-block px-2 py-1 bg-gold/20 text-gold-dark dark:text-gold-light text-xs font-medium rounded">
            {article.category || "General"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {getTimeAgo(article.publishedAt)}
          </span>
        </div>
        <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">{article.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {truncateText(article.description || "", 120)}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2">
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {article.source?.charAt(0) || "N"}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{article.source}</span>
          </div>
          <div className="flex space-x-2">
            <button 
              className={cn(
                "p-1 transition-colors",
                isFavorited ? "text-gold" : "text-gray-400 hover:text-gold"
              )}
              onClick={handleToggleFavorite}
              disabled={isLoading}
            >
              {isFavorited ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </button>
            <button 
              className="p-1 text-gray-400 hover:text-navy-default dark:hover:text-navy-light" 
              onClick={handleShare}
            >
              <Share className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
