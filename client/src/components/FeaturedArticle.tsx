import { Article } from "@shared/schema";
import { getTimeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FeaturedArticleProps {
  article: Article;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  if (!article) return null;
  
  return (
    <section className="mb-8">
      <div className="relative rounded-xl overflow-hidden h-64 md:h-80 bg-gradient-to-r from-gold to-amber-200">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-default/80 to-navy-default/40 flex items-center">
          <div className="px-6 md:px-10 text-white max-w-xl">
            <span className="inline-block px-2 py-1 bg-gold text-navy-dark text-xs font-bold rounded mb-2">FEATURED</span>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{article.title}</h2>
            <p className="text-sm md:text-base opacity-90 mb-4">{article.description}</p>
            <div className="flex items-center text-sm opacity-80 mb-4">
              <span>{article.source}</span>
              <span className="mx-2">•</span>
              <span>{getTimeAgo(article.publishedAt)}</span>
            </div>
            <Button 
              asChild
              variant="outline"
              className="inline-flex items-center bg-white text-navy-default px-4 py-2 rounded-full font-medium hover:bg-gold transition duration-200"
            >
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read Article
                <svg className="ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
