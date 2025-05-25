import os
import psycopg2
from datetime import datetime

# الاتصال بقاعدة البيانات من متغير البيئة
DATABASE_URL = os.getenv("DATABASE_URL")

# الاتصال بقاعدة البيانات
conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

# بيانات الخبر
title = "Gold demand rises amid global uncertainty"
published_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

# إدراج الخبر في جدول articles
insert_query = """
INSERT INTO articles (title, published_at)
VALUES (%s, %s)
"""
cursor.execute(insert_query, (title, published_at))
conn.commit()

print("✅ تم إدخال الخبر بنجاح!")

cursor.close()
conn.close()
