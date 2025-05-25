import os
import psycopg2
from datetime import datetime

# الاتصال بالقاعدة باستخدام متغير البيئة
DATABASE_URL = os.getenv("DATABASE_URL")
conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

# استعلام لعرض جميع المقالات مرتبة بالأحدث أولاً
select_query = """
SELECT id, title, published_at, sentiment 
FROM articles 
ORDER BY published_at DESC
"""
cursor.execute(select_query)
articles = cursor.fetchall()

# عرض عدد المقالات المسترجعة
print(f"تم العثور على {len(articles)} مقالة في قاعدة البيانات\n")

# عرض المقالات
print("قائمة المقالات:")
print("-" * 80)
print(f"{'المعرف':<5} | {'التاريخ':<20} | {'المشاعر':<10} | {'العنوان'}")
print("-" * 80)

for article in articles:
    article_id, title, published_at, sentiment = article
    # تنسيق التاريخ إذا كان متاحًا
    date_str = published_at.strftime("%Y-%m-%d %H:%M:%S") if published_at else "غير متاح"
    # تنسيق المشاعر مع لون افتراضي إذا كانت غير متاحة
    sentiment_str = sentiment if sentiment else "غير محلل"
    
    # اقتطاع العنوان إذا كان طويلًا جدًا
    title_truncated = (title[:50] + '...') if title and len(title) > 50 else title
    
    print(f"{article_id:<5} | {date_str:<20} | {sentiment_str:<10} | {title_truncated}")

# إغلاق الاتصال
cursor.close()
conn.close()