import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Article } from "@shared/schema";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { FeaturedArticle } from "@/components/FeaturedArticle";
import { ArticleCard } from "@/components/ArticleCard";
import { SentimentAnalysis } from "@/components/SentimentAnalysis";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  
  // Parse URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const tabParam = params.get('tab');
    const categoryParam = params.get('category');
    const searchParam = params.get('q');
    
    if (tabParam) {
      setActiveTab(tabParam);
    }
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location]);
  
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
  
  // Fetch news articles
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/news', searchQuery],
    enabled: true,
  });
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    refetch();
  };
  
  const handleFilterChange = (filters: any) => {
    // Apply filters to the news fetch
    console.log("Applying filters:", filters);
    refetch();
    
    toast({
      title: "Filters applied",
      description: "Your news feed has been updated with the selected filters.",
    });
  };
  
  const handleToggleFavorite = (article: Article, isFavorited: boolean) => {
    if (isFavorited) {
      // Add to favorites
      setFavorites(prev => {
        const newFavorites = [...prev, article.id];
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        return newFavorites;
      });
    } else {
      // Remove from favorites
      setFavorites(prev => {
        const newFavorites = prev.filter(id => id !== article.id);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        return newFavorites;
      });
    }
  };
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  const handleLoadMore = () => {
    // In a real implementation, this would load more articles
    toast({
      title: "Loading more articles",
      description: "Fetching additional news articles...",
    });
  };
  
  // Find a featured article
  const featuredArticle = data?.articles?.[0];
  
  // Other articles
  const articles = data?.articles?.slice(1) || [];
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-navy-default/95 text-gray-800 dark:text-gray-200">
      <Header onSearch={handleSearch} />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <Sidebar onFilterChange={handleFilterChange} />
          
          <div className="lg:w-3/4">
            {/* Featured Section */}
            {isLoading ? (
              <div className="mb-8 h-64 md:h-80 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
            ) : featuredArticle ? (
              <FeaturedArticle article={featuredArticle} />
            ) : null}
            
            {/* News Feed Sections */}
            <section>
              {/* Tabs Navigation */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex overflow-x-auto hide-scrollbar space-x-8">
                  <button 
                    className={`${activeTab === 'latest' ? 'text-gold border-b-2 border-gold' : 'text-gray-500 dark:text-gray-400 hover:text-navy-default dark:hover:text-white'} font-medium pb-2 px-1 whitespace-nowrap`}
                    onClick={() => handleTabChange('latest')}
                  >
                    Latest News
                  </button>
                  <button 
                    className={`${activeTab === 'top' ? 'text-gold border-b-2 border-gold' : 'text-gray-500 dark:text-gray-400 hover:text-navy-default dark:hover:text-white'} font-medium pb-2 px-1 whitespace-nowrap`}
                    onClick={() => handleTabChange('top')}
                  >
                    Top Stories
                  </button>
                  <button 
                    className={`${activeTab === 'analysis' ? 'text-gold border-b-2 border-gold' : 'text-gray-500 dark:text-gray-400 hover:text-navy-default dark:hover:text-white'} font-medium pb-2 px-1 whitespace-nowrap`}
                    onClick={() => handleTabChange('analysis')}
                  >
                    Market Analysis
                  </button>
                  <button 
                    className={`${activeTab === 'opinions' ? 'text-gold border-b-2 border-gold' : 'text-gray-500 dark:text-gray-400 hover:text-navy-default dark:hover:text-white'} font-medium pb-2 px-1 whitespace-nowrap`}
                    onClick={() => handleTabChange('opinions')}
                  >
                    Expert Opinions
                  </button>
                </div>
              </div>
              
              {/* News Cards */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-navy-dark/80 rounded-lg shadow-sm overflow-hidden p-5">
                      <Skeleton className="h-4 w-20 mb-3" />
                      <Skeleton className="h-6 w-full mb-2" />
                      <Skeleton className="h-6 w-4/5 mb-2" />
                      <Skeleton className="h-4 w-full mb-3" />
                      <Skeleton className="h-4 w-5/6 mb-3" />
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-24" />
                        <div className="flex space-x-2">
                          <Skeleton className="h-6 w-6 rounded-full" />
                          <Skeleton className="h-6 w-6 rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-10">
                  <p className="text-red-500 dark:text-red-400 mb-2">Error loading news</p>
                  <Button onClick={() => refetch()}>Try Again</Button>
                </div>
              ) : articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.map((article) => (
                    <ArticleCard 
                      key={article.id}
                      article={article}
                      isFavorite={favorites.includes(article.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400 mb-2">No articles found</p>
                  {searchQuery && (
                    <p className="mb-4">Try adjusting your search terms</p>
                  )}
                  <Button onClick={() => refetch()}>Refresh</Button>
                </div>
              )}
              
              {/* Load More Button */}
              {articles.length > 0 && (
                <div className="mt-8 text-center">
                  <Button 
                    variant="outline" 
                    onClick={handleLoadMore}
                    className="bg-white dark:bg-transparent border border-gray-300 dark:border-gray-700 text-navy-default dark:text-white hover:bg-gray-50 dark:hover:bg-navy-dark/50"
                  >
                    Load More News
                  </Button>
                </div>
              )}
            </section>
            
            {/* Sentiment Analysis Section */}
            <SentimentAnalysis />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
