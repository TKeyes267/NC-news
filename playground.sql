\c nc_news_test

-- SELECT articles .*, COUNT(comments.article_id) AS comment_count
-- FROM articles
-- LEFT JOIN comments
-- ON articles.article_id = comments.article_id
-- GROUP BY articles.article_id;


-- SELECT articles .*, CAST(COUNT(comments.article_id) AS INT)  AS comment_count
-- FROM articles
-- LEFT JOIN comments
-- ON articles.article_id = comments.article_id
-- GROUP BY articles.article_id
-- ORDER BY articles.created_at DESC

SELECT *
    FROM comments
    LEFT JOIN articles 
    WHERE comments.article_id = $1
    ORDER BY created_at DESC