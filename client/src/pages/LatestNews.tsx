import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type NewsArticle = {
  id: number;
  title: string;
  publishedAt: string;
  sentiment: string;
};

export default function LatestNews() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/latest-gold-news'],
    enabled: true,
  });
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Get the sentiment badge color based on sentiment value
  const getSentimentBadge = (sentiment: string) => {
    switch(sentiment?.toLowerCase()) {
      case 'positive':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Positive</span>;
      case 'negative':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Negative</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Neutral</span>;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-navy-default/95 text-gray-800 dark:text-gray-200">
      <Header onSearch={handleSearch} />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="bg-white dark:bg-navy-dark/80 rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold mb-2 text-navy-default dark:text-white">Latest Gold News</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The most recent 10 articles about gold from our database, with sentiment analysis
          </p>
          
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500 dark:text-red-400 mb-2">Error loading latest news</p>
              <button 
                className="px-4 py-2 bg-navy-default text-white rounded hover:bg-navy-dark"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Sentiment
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {data && Array.isArray(data.articles) ? data.articles.map((article: NewsArticle) => (
                    <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-normal">
                        <div className="text-sm font-medium text-navy-default dark:text-white line-clamp-2">
                          {article.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(article.publishedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getSentimentBadge(article.sentiment)}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        No articles found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}