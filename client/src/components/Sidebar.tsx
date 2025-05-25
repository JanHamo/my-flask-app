import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  CreditCard, 
  TrendingUp, 
  Globe, 
  Coins, 
  FileText, 
  Filter, 
  ArrowUp 
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  onFilterChange: (filters: any) => void;
}

export function Sidebar({ onFilterChange }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const [dateRange, setDateRange] = useState("day");
  const [sources, setSources] = useState({
    bloomberg: true,
    reuters: true,
    financialTimes: true,
    cnbc: false
  });
  const [sortBy, setSortBy] = useState("recent");
  
  const handleSourceChange = (source: keyof typeof sources) => {
    setSources(prev => ({
      ...prev,
      [source]: !prev[source]
    }));
  };
  
  const applyFilters = () => {
    onFilterChange({
      dateRange,
      sources,
      sortBy
    });
  };
  
  return (
    <aside className="lg:w-1/4 space-y-6">
      {/* Categories Section */}
      <div className="bg-white dark:bg-navy-dark/80 rounded-lg shadow-sm p-4">
        <h2 className="font-bold text-lg mb-3 text-navy-default dark:text-white">Categories</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/?category=markets">
              <a className={`flex items-center space-x-2 p-2 rounded-md font-medium ${location.includes('category=markets') ? 'bg-gold/10 text-gold-dark dark:text-gold-light' : 'hover:bg-gray-100 dark:hover:bg-navy-dark/50 text-gray-700 dark:text-gray-200'}`}>
                <CreditCard className="h-4 w-4" />
                <span>Gold Markets</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/?category=investment">
              <a className={`flex items-center space-x-2 p-2 rounded-md font-medium ${location.includes('category=investment') ? 'bg-gold/10 text-gold-dark dark:text-gold-light' : 'hover:bg-gray-100 dark:hover:bg-navy-dark/50 text-gray-700 dark:text-gray-200'}`}>
                <TrendingUp className="h-4 w-4" />
                <span>Investments</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/?category=economy">
              <a className={`flex items-center space-x-2 p-2 rounded-md font-medium ${location.includes('category=economy') ? 'bg-gold/10 text-gold-dark dark:text-gold-light' : 'hover:bg-gray-100 dark:hover:bg-navy-dark/50 text-gray-700 dark:text-gray-200'}`}>
                <Globe className="h-4 w-4" />
                <span>Global Economy</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/?category=commodities">
              <a className={`flex items-center space-x-2 p-2 rounded-md font-medium ${location.includes('category=commodities') ? 'bg-gold/10 text-gold-dark dark:text-gold-light' : 'hover:bg-gray-100 dark:hover:bg-navy-dark/50 text-gray-700 dark:text-gray-200'}`}>
                <Coins className="h-4 w-4" />
                <span>Commodities</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/?category=analysis">
              <a className={`flex items-center space-x-2 p-2 rounded-md font-medium ${location.includes('category=analysis') ? 'bg-gold/10 text-gold-dark dark:text-gold-light' : 'hover:bg-gray-100 dark:hover:bg-navy-dark/50 text-gray-700 dark:text-gray-200'}`}>
                <FileText className="h-4 w-4" />
                <span>Analysis & Opinion</span>
              </a>
            </Link>
          </li>
        </ul>
      </div>
      
      {/* Filters Section */}
      <div className="bg-white dark:bg-navy-dark/80 rounded-lg shadow-sm p-4">
        <h2 className="font-bold text-lg mb-3 text-navy-default dark:text-white">Filters</h2>
        
        {/* Date Filter */}
        <div className="mb-4">
          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Range</Label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Sources Filter */}
        <div className="mb-4">
          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sources</Label>
          <div className="space-y-1">
            <div className="flex items-center">
              <Checkbox 
                id="source1" 
                checked={sources.bloomberg} 
                onCheckedChange={() => handleSourceChange('bloomberg')} 
                className="h-4 w-4 text-gold focus:ring-gold"
              />
              <Label htmlFor="source1" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Bloomberg
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox 
                id="source2" 
                checked={sources.reuters} 
                onCheckedChange={() => handleSourceChange('reuters')} 
                className="h-4 w-4 text-gold focus:ring-gold"
              />
              <Label htmlFor="source2" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Reuters
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox 
                id="source3" 
                checked={sources.financialTimes} 
                onCheckedChange={() => handleSourceChange('financialTimes')} 
                className="h-4 w-4 text-gold focus:ring-gold"
              />
              <Label htmlFor="source3" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Financial Times
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox 
                id="source4" 
                checked={sources.cnbc} 
                onCheckedChange={() => handleSourceChange('cnbc')} 
                className="h-4 w-4 text-gold focus:ring-gold"
              />
              <Label htmlFor="source4" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                CNBC
              </Label>
            </div>
          </div>
        </div>
        
        {/* Relevance Filter */}
        <div>
          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select sorting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="relevant">Most Relevant</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={applyFilters}
          className="mt-4 w-full bg-navy-default hover:bg-navy-dark text-white"
        >
          Apply Filters
        </Button>
      </div>
      
      {/* Gold Price Widget */}
      <div className="bg-white dark:bg-navy-dark/80 rounded-lg shadow-sm p-4">
        <h2 className="font-bold text-lg mb-3 text-navy-default dark:text-white">Gold Price</h2>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-600 dark:text-gray-400 text-sm">Current</span>
            <div className="text-2xl font-bold text-gold">$1,937.42</div>
            <div className="text-green-500 text-sm font-medium flex items-center">
              <ArrowUp className="mr-1 h-3 w-3" />
              +0.8%
            </div>
          </div>
          
          <div className="w-24 h-16 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
            {/* Mini chart */}
            <div className="h-10 w-full px-2 flex items-end space-x-1">
              <div className="h-3 w-1 bg-gold rounded-t"></div>
              <div className="h-5 w-1 bg-gold rounded-t"></div>
              <div className="h-4 w-1 bg-gold rounded-t"></div>
              <div className="h-7 w-1 bg-gold rounded-t"></div>
              <div className="h-6 w-1 bg-gold rounded-t"></div>
              <div className="h-8 w-1 bg-gold rounded-t"></div>
              <div className="h-9 w-1 bg-gold rounded-t"></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
