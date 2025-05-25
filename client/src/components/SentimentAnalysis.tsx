import { getSentimentPercent } from "@/lib/utils";

export function SentimentAnalysis() {
  const sentiment = getSentimentPercent();
  
  return (
    <section className="mt-10 bg-white dark:bg-navy-dark/80 rounded-lg shadow-sm p-6">
      <h2 className="font-bold text-xl mb-4 text-navy-default dark:text-white">Gold News Sentiment Analysis</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Current market sentiment based on analysis of recent gold-related news articles.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/20">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-green-700 dark:text-green-400">Positive</span>
            <span className="text-green-700 dark:text-green-400 font-bold">{sentiment.positive}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-green-500 h-2.5 rounded-full" 
              style={{ width: `${sentiment.positive}%` }}
            ></div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-700 dark:text-gray-300">Neutral</span>
            <span className="text-gray-700 dark:text-gray-300 font-bold">{sentiment.neutral}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-gray-500 h-2.5 rounded-full" 
              style={{ width: `${sentiment.neutral}%` }}
            ></div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/20">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-red-700 dark:text-red-400">Negative</span>
            <span className="text-red-700 dark:text-red-400 font-bold">{sentiment.negative}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-red-500 h-2.5 rounded-full" 
              style={{ width: `${sentiment.negative}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
        Based on analysis of 127 articles published in the last 7 days
      </div>
    </section>
  );
}
