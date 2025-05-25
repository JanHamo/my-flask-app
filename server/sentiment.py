import nltk
import sys
import json

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
    Returns 'positive', 'negative', or 'neutral' based on the compound score.
    """
    # Initialize the sentiment analyzer
    sid = SentimentIntensityAnalyzer()
    
    # Get sentiment scores
    scores = sid.polarity_scores(text)
    
    # Determine sentiment based on the compound score
    if scores['compound'] >= 0.05:
        return 'positive'
    elif scores['compound'] <= -0.05:
        return 'negative'
    else:
        return 'neutral'

def get_sentiment_scores(text):
    """
    Analyze the sentiment and return detailed scores.
    """
    sid = SentimentIntensityAnalyzer()
    scores = sid.polarity_scores(text)
    
    # Add classification
    if scores['compound'] >= 0.05:
        scores['classification'] = 'positive'
    elif scores['compound'] <= -0.05:
        scores['classification'] = 'negative'
    else:
        scores['classification'] = 'neutral'
    
    return scores

if __name__ == "__main__":
    # Check if text is provided as an argument
    if len(sys.argv) > 1:
        # Join all arguments as they might contain spaces
        input_text = ' '.join(sys.argv[1:])
        
        # Analyze sentiment
        result = get_sentiment_scores(input_text)
        
        # Print result as JSON for easy parsing in Node.js
        print(json.dumps(result))
    else:
        print(json.dumps({"error": "No text provided for sentiment analysis"}))