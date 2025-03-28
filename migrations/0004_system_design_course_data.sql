-- Step 1: Create temporary tables
DROP TABLE IF EXISTS temp_ids;
DROP TABLE IF EXISTS temp_lesson_ids;

CREATE TEMPORARY TABLE temp_ids (
    course_id INTEGER,
    author_id INTEGER,
    topic1_id INTEGER,
    topic2_id INTEGER,
    topic3_id INTEGER,
    topic4_id INTEGER
);

CREATE TEMPORARY TABLE temp_lesson_ids (
    id INTEGER,
    topic_id INTEGER,
    title TEXT
);

-- Step 2: Insert course data
INSERT INTO courses (title, description, difficulty_level, image_url, category_id, is_featured, status, prerequisites, estimated_hours, order_index) 
VALUES (
    'System Design Fundamentals',
    'Learn how to design scalable systems. Master the principles and practices of designing large-scale distributed systems for real-world applications and technical interviews.',
    'Intermediate',
    '/images/system-design.jpg',
    3,
    1,
    'published',
    'Basic understanding of programming concepts and data structures',
    40,
    1
);

INSERT INTO temp_ids (course_id) 
SELECT last_insert_rowid();

-- Step 3: Insert author data
INSERT INTO course_authors (name, bio, avatar_url)
VALUES (
    'Alex Xu',
    'Alex Xu is the author of the System Design Interview book series and the creator of ByteByteGo, a platform dedicated to helping software engineers prepare for system design interviews.',
    '/images/authors/alex-xu.jpg'
);

UPDATE temp_ids SET author_id = last_insert_rowid();

-- Step 4: Map author to course
INSERT INTO course_author_mappings (course_id, author_id, is_primary)
SELECT course_id, author_id, 1 FROM temp_ids;

-- Step 5: Insert tags
INSERT INTO tags (name) 
VALUES 
    ('System Design'),
    ('Distributed Systems'),
    ('Scalability'),
    ('Technical Interview'),
    ('Software Architecture')
ON CONFLICT(name) DO NOTHING;

-- Step 6: Map tags to course
INSERT INTO course_tags (course_id, tag_id)
SELECT t.course_id, tags.id 
FROM temp_ids t
CROSS JOIN tags 
WHERE tags.name IN (
    'System Design',
    'Distributed Systems',
    'Scalability',
    'Technical Interview',
    'Software Architecture'
);

-- Step 7: Insert topics
-- Topic 1: Scale From Zero To Millions Of Users
INSERT INTO topics (course_id, title, description, order_index)
SELECT course_id, 'Scale From Zero To Millions Of Users',
       'Learn how to scale a system from a single server to a distributed architecture that can handle millions of users',
       1
FROM temp_ids;
UPDATE temp_ids SET topic1_id = last_insert_rowid();

-- Topic 2: Back-of-the-envelope Estimation
INSERT INTO topics (course_id, title, description, order_index)
SELECT course_id, 'Back-of-the-envelope Estimation',
       'Master the art of quick calculations to estimate system capacity, performance, and resource requirements',
       2
FROM temp_ids;
UPDATE temp_ids SET topic2_id = last_insert_rowid();

-- Topic 3: System Design Interview Framework
INSERT INTO topics (course_id, title, description, order_index)
SELECT course_id, 'System Design Interview Framework',
       'A structured approach to tackle any system design problem in interviews or real-world scenarios',
       3
FROM temp_ids;
UPDATE temp_ids SET topic3_id = last_insert_rowid();

-- Topic 4: Design A Rate Limiter
INSERT INTO topics (course_id, title, description, order_index)
SELECT course_id, 'Design A Rate Limiter',
       'Learn different algorithms and approaches to implement rate limiting in distributed systems',
       4
FROM temp_ids;
UPDATE temp_ids SET topic4_id = last_insert_rowid();

-- Step 8: Insert lessons for Topic 1
INSERT INTO lessons (topic_id, title, content, xp_reward, order_index) VALUES
((SELECT topic1_id FROM temp_ids), 'Single Server Setup',
 'In this lesson, we will start with a simple setup: everything on one server. We will explore the components needed for a basic web application including web server, database, and application logic.

A single server setup typically includes:
- Web server (Nginx, Apache)
- Application server
- Database (MySQL, PostgreSQL)
- Static content

This setup is simple but has significant limitations in terms of scalability and reliability.',
 15, 1);

-- Continue lessons for Topic 1
INSERT INTO lessons (topic_id, title, content, xp_reward, order_index) VALUES
((SELECT topic1_id FROM temp_ids), 'Database Replication',
 'As your application grows, you need to separate the database from the web/application server. Database replication creates copies of the database to reduce the load on the primary database and improve read performance.

We will cover:
- Primary-secondary replication
- Primary-primary replication
- Advantages and disadvantages of each approach
- How to handle replication lag and consistency issues',
 20, 2),
 
((SELECT topic1_id FROM temp_ids), 'Caching Strategies',
 'Caching is a technique to store frequently accessed data in memory to reduce database load and improve response times.

In this lesson, we will explore:
- Different caching strategies (cache-aside, write-through, write-behind)
- Cache invalidation techniques
- Cache eviction policies (LRU, LFU, FIFO)
- Distributed caching with tools like Redis and Memcached
- CDN caching for static content',
 20, 3),
 
((SELECT topic1_id FROM temp_ids), 'Load Balancing',
 'Load balancers distribute incoming traffic across multiple servers to ensure no single server bears too much load.

We will discuss:
- Hardware vs. software load balancers
- Load balancing algorithms (round-robin, least connections, IP hash)
- Layer 4 vs. Layer 7 load balancing
- Health checks and server pools
- Sticky sessions and session persistence',
 20, 4);
 
-- Add remaining Topic 1 lessons
INSERT INTO lessons (topic_id, title, content, xp_reward, order_index) VALUES
((SELECT topic1_id FROM temp_ids), 'Database Sharding',
 'As data grows, a single database server may not be sufficient. Sharding is a technique to horizontally partition data across multiple database servers.

This lesson covers:
- Sharding strategies (hash-based, range-based, directory-based)
- Challenges with sharding (joins, transactions, schema changes)
- Consistent hashing for dynamic sharding
- Sharding vs. partitioning',
 25, 5),
 
((SELECT topic1_id FROM temp_ids), 'Microservices Architecture',
 'Breaking down a monolithic application into smaller, loosely coupled services can improve scalability and development velocity.

We will explore:
- Microservices vs. monolithic architecture
- Service discovery and registration
- API gateway pattern
- Inter-service communication (synchronous vs. asynchronous)
- Challenges and best practices',
 25, 6);

-- Add Topic 2 lessons
INSERT INTO lessons (topic_id, title, content, xp_reward, order_index) VALUES
((SELECT topic2_id FROM temp_ids), 'Power of Two',
 'Understanding powers of two is fundamental for system design calculations. In this lesson, we will learn how to work with powers of two and common size units.

We will cover:
- Byte, Kilobyte, Megabyte, Gigabyte, Terabyte, Petabyte
- Memory and storage conversions
- Bandwidth calculations
- Quick mental math techniques for powers of two',
 15, 1),
 
((SELECT topic2_id FROM temp_ids), 'Latency Numbers',
 'Every system designer should know the approximate latency of various operations. This knowledge helps in making informed design decisions.

In this lesson, we will memorize and understand:
- Memory access: ~100ns
- SSD random read: ~100μs
- Network round trip within same datacenter: ~1ms
- Network round trip cross-continental: ~100ms
- Disk seek: ~10ms
- Reading 1MB sequentially from memory: ~10μs
- Reading 1MB sequentially from SSD: ~1ms
- Reading 1MB sequentially from disk: ~20ms',
 20, 2);

-- Store lesson IDs for later use
INSERT INTO temp_lesson_ids (id, topic_id, title)
SELECT id, topic_id, title FROM lessons
WHERE topic_id IN (
    SELECT topic1_id FROM temp_ids
    UNION ALL
    SELECT topic2_id FROM temp_ids
    UNION ALL
    SELECT topic3_id FROM temp_ids
    UNION ALL
    SELECT topic4_id FROM temp_ids
);
