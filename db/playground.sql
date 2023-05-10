\c nc_news_test

SELECT author, title, article_id, topic, created_at, votes, article_img_url, (SELECT COUNT(article_id) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count FROM articles
ORDER BY created_at DESC ;