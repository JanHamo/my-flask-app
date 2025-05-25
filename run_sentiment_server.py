import subprocess
import sys
import time

print("Starting sentiment analysis server...")
try:
    # Start the sentiment analysis server on port 8001
    sentiment_server = subprocess.Popen([sys.executable, "server/sentiment_api.py"], 
                                        stdout=subprocess.PIPE,
                                        stderr=subprocess.PIPE)
    
    # Give it a moment to start
    time.sleep(2)
    
    if sentiment_server.poll() is None:
        print("Sentiment analysis server is running")
    else:
        print("Failed to start sentiment server")
        stdout, stderr = sentiment_server.communicate()
        print("STDOUT:", stdout.decode())
        print("STDERR:", stderr.decode())
        
except Exception as e:
    print(f"Error starting sentiment server: {e}")