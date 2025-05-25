import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-navy-default text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-6 h-6 text-gold" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 7h-3a2 2 0 0 1-2-2V2"></path>
                <path d="M16 2H4a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7Z"></path>
              </svg>
              <h2 className="text-xl font-bold">
                Gold<span className="text-gold">News</span>
              </h2>
            </div>
            <p className="text-gray-300 text-sm">
              Comprehensive news and analysis about gold markets, investments, and trends, delivered to you in real-time.
            </p>
          </div>
          
          <div>
            <h3 className="text-gold font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/"><a className="hover:text-gold">Home</a></Link></li>
              <li><Link href="/?tab=latest"><a className="hover:text-gold">Latest News</a></Link></li>
              <li><Link href="/?tab=analysis"><a className="hover:text-gold">Market Analysis</a></Link></li>
              <li><Link href="/?category=investment"><a className="hover:text-gold">Investment Guides</a></Link></li>
              <li><a href="#" className="hover:text-gold">Price Charts</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gold font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-gold">Learning Center</a></li>
              <li><a href="#" className="hover:text-gold">Gold Investment Guide</a></li>
              <li><a href="#" className="hover:text-gold">Market Reports</a></li>
              <li><a href="#" className="hover:text-gold">Economic Calendar</a></li>
              <li><a href="#" className="hover:text-gold">Newsletter</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gold font-medium mb-4">Stay Connected</h3>
            <p className="text-gray-300 text-sm mb-4">Subscribe to our newsletter for weekly updates on gold markets.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-3 py-2 text-sm bg-navy-dark text-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-gold w-full" 
              />
              <button className="bg-gold hover:bg-gold-dark text-navy-dark px-3 py-2 rounded-r-md transition duration-200">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m22 2-7 20-4-9-9-4Z"/>
                  <path d="M22 2 11 13"/>
                </svg>
              </button>
            </div>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-300 hover:text-gold">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-gold">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-gold">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-gold">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-navy-light mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© 2023 GoldNews. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-400 hover:text-gold">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-400 hover:text-gold">Terms of Service</a>
            <a href="#" className="text-sm text-gray-400 hover:text-gold">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
