# insert_article_manual.py
import os
import psycopg2
from datetime import datetime

DATABASE_URL = os.getenv("DATABASE_URL")
conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

title = "Gold prices fall as US inflation expectations rise"
published_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

insert_query = """
INSERT INTO articles (title, published_at)
VALUES (%s, %s)
"""
cursor.execute(insert_query, (title, published_at))
conn.commit()

print("✅ تم إدخال الخبر بنجاح!")

cursor.close()
conn.close()
