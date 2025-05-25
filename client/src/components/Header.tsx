import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Bookmark, Menu, Search } from "lucide-react";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const [location, setLocation] = useLocation();
  const { toggleTheme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <header className="bg-white dark:bg-navy-dark shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className="w-7 h-7 text-gold" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7h-3a2 2 0 0 1-2-2V2"></path>
            <path d="M16 2H4a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7Z"></path>
          </svg>
          <Link href="/" className="text-2xl font-bold text-navy-default dark:text-white">
            Gold<span className="text-gold">News</span>
          </Link>
        </div>
        
        {/* Search Bar (Desktop) */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search for gold news, trends, investments..."
              className="w-full py-2 pl-10 pr-4 rounded-full border focus:ring-2 focus:ring-gold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <Button 
            type="submit" 
            className="ml-2 bg-gold hover:bg-gold-dark text-white px-4 py-2 rounded-full"
          >
            Search
          </Button>
        </form>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-1">
            <span className="text-sm text-gray-600 dark:text-gray-300">EN</span>
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
          
          <Link href="/latest-news">
            <a className={cn(
              "p-2 hover:text-gold transition-colors hidden md:inline-block",
              location === "/latest-news" ? "text-gold" : "text-gray-600 dark:text-gray-300"
            )}>
              <span className="text-sm font-medium">Latest News</span>
            </a>
          </Link>
          
          <Link href="/favorites">
            <a className={cn(
              "p-2 hover:text-gold transition-colors",
              location === "/favorites" ? "text-gold" : "text-gray-600 dark:text-gray-300"
            )}>
              <Bookmark className="h-5 w-5" />
            </a>
          </Link>
          
          <button 
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gold transition-colors" 
            onClick={toggleTheme}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <button 
            className="md:hidden p-2 text-gray-600 dark:text-gray-300" 
            onClick={toggleMobileMenu}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            placeholder="Search gold news..."
            className="w-full py-2 pl-10 pr-4 rounded-full border focus:ring-2 focus:ring-gold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Button 
            type="submit"
            className="absolute right-1 top-1 bg-gold hover:bg-gold-dark text-white p-1.5 rounded-full h-8 w-8"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}
