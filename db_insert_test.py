import os
import psycopg2
from datetime import datetime

# جلب بيانات الاتصال من متغير البيئة
DATABASE_URL = os.getenv("DATABASE_URL")

# الاتصال بالقاعدة باستخدام URI مباشرة
conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

# مثال على خبر جديد (للاختبار)
title = "Gold prices fall amid strong US dollar"
published_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
description = "Analysts suggest temporary dip in gold prices as dollar strengthens"
url = "https://example.com/gold-prices-fall"
sentiment = "negative"

insert_query = """
INSERT INTO articles (title, published_at, description, url, sentiment)
VALUES (%s, %s, %s, %s, %s)
RETURNING id;
"""

cursor.execute(insert_query, (title, published_at, description, url, sentiment))
article_id = cursor.fetchone()[0]
conn.commit()

print(f"✅ تم إدخال الخبر الجديد بنجاح بمعرف: {article_id}")

# التحقق من وجود الخبر في قاعدة البيانات
cursor.execute("SELECT id, title, sentiment FROM articles WHERE id = %s", (article_id,))
result = cursor.fetchone()
print(f"التحقق: المعرف: {result[0]}, العنوان: {result[1]}, التحليل العاطفي: {result[2]}")

cursor.close()
conn.close()