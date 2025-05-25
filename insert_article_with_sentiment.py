import os
import psycopg2
import requests
from datetime import datetime

# الاتصال بالقاعدة باستخدام متغير البيئة (من Secrets في Replit)
DATABASE_URL = os.getenv("DATABASE_URL")
conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

# عنوان الخبر الجديد (مع وصف)
new_title = "Gold prices rise as investors seek safe haven assets"
description = "Investors turn to gold as global uncertainty increases, pushing prices higher"
published_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
url = "https://example.com/gold-rise-safe-haven"
source = "Market Analysis"

# تحليل المشاعر باستخدام خدمة التحليل المحلية
try:
    sentiment_text = new_title + " " + description
    sentiment_response = requests.post("http://localhost:8001", data=sentiment_text.encode('utf-8'))
    sentiment = sentiment_response.json().get("sentiment", "neutral")
    print(f"تم تحليل المشاعر: {sentiment}")
except Exception as e:
    sentiment = "positive"  # افتراضي بناءً على محتوى العنوان
    print(f"تعذر تحليل المشاعر: {e}. استخدام القيمة الافتراضية: {sentiment}")

# تنفيذ عملية الإدخال مع المشاعر
insert_query = """
INSERT INTO articles (title, description, url, source, published_at, sentiment)
VALUES (%s, %s, %s, %s, %s, %s)
RETURNING id
"""
cursor.execute(insert_query, (new_title, description, url, source, published_at, sentiment))
article_id = cursor.fetchone()[0]
conn.commit()

print(f"✅ تم إدخال الخبر بنجاح. معرف المقال: {article_id}")

# التحقق من الإدخال
cursor.execute("SELECT id, title, sentiment FROM articles WHERE id = %s", (article_id,))
result = cursor.fetchone()
print(f"التحقق: المعرف: {result[0]}, العنوان: {result[1]}, التحليل العاطفي: {result[2]}")

# إغلاق الاتصال
cursor.close()
conn.close()