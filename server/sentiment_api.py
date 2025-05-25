import nltk
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib.parse

# Download necessary NLTK data (only needed the first time)
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('sentiment/vader_lexicon.zip')
except LookupError:
    nltk.download('vader_lexicon')

from nltk.sentiment.vader import SentimentIntensityAnalyzer

def analyze_sentiment(text):
    """
    Analyze the sentiment of the provided text using NLTK's VADER.
    Returns detailed sentiment scores and classification.
    """
    # Initialize the sentiment analyzer
    sid = SentimentIntensityAnalyzer()
    
    # Get sentiment scores
    scores = sid.polarity_scores(text)
    
    # Add classification as a string
    classification = ""
    if scores['compound'] >= 0.05:
        classification = 'positive'
    elif scores['compound'] <= -0.05:
        classification = 'negative'
    else:
        classification = 'neutral'
    
    result = {
        'neg': scores['neg'],
        'neu': scores['neu'],
        'pos': scores['pos'],
        'compound': scores['compound'],
        'classification': classification
    }
    
    return result

class SentimentHandler(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
    def do_GET(self):
        self._set_headers()
        parsed_path = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_path.query)
        
        # Get text from query parameters
        if 'text' in query_params:
            text = query_params['text'][0]
            result = analyze_sentiment(text)
            self.wfile.write(json.dumps(result).encode())
        else:
            self.wfile.write(json.dumps({"error": "No text provided"}).encode())
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
            text = data.get('text', '')
            
            if text:
                result = analyze_sentiment(text)
                self._set_headers()
                self.wfile.write(json.dumps(result).encode())
            else:
                self._set_headers()
                self.wfile.write(json.dumps({"error": "No text provided"}).encode())
        except json.JSONDecodeError:
            self._set_headers()
            self.wfile.write(json.dumps({"error": "Invalid JSON"}).encode())

def run_server(port=8001):
    server_address = ('localhost', port)
    httpd = HTTPServer(server_address, SentimentHandler)
    print(f"Starting sentiment analysis server on port {port}")
    httpd.serve_forever()

if __name__ == "__main__":
    run_server()