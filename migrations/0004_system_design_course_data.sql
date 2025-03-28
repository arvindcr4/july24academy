-- Insert System Design course data
INSERT INTO courses (title, description, difficulty_level, image_url, category_id, is_featured, status, prerequisites, estimated_hours, order_index) 
VALUES (
  'System Design Fundamentals', 
  'Learn how to design scalable systems. Master the principles and practices of designing large-scale distributed systems for real-world applications and technical interviews.',
  'Intermediate',
  '/images/system-design.jpg',
  3, -- System Design category
  TRUE,
  'published',
  'Basic understanding of programming concepts and data structures',
  40,
  1
);

-- Get the course ID
SELECT @course_id := last_insert_id();

-- Insert course authors
INSERT INTO course_authors (name, bio, avatar_url)
VALUES (
  'Alex Xu',
  'Alex Xu is the author of the System Design Interview book series and the creator of ByteByteGo, a platform dedicated to helping software engineers prepare for system design interviews.',
  '/images/authors/alex-xu.jpg'
);

-- Get the author ID
SELECT @author_id := last_insert_id();

-- Map author to course
INSERT INTO course_author_mappings (course_id, author_id, is_primary)
VALUES (@course_id, @author_id, TRUE);

-- Insert course tags
INSERT INTO tags (name) VALUES 
('System Design'),
('Distributed Systems'),
('Scalability'),
('Technical Interview'),
('Software Architecture');

-- Map tags to course
INSERT INTO course_tags (course_id, tag_id)
SELECT @course_id, id FROM tags WHERE name IN ('System Design', 'Distributed Systems', 'Scalability', 'Technical Interview', 'Software Architecture');

-- Insert course resources
INSERT INTO course_resources (course_id, title, description, resource_type, resource_url, order_index)
VALUES
(@course_id, 'System Design Interview Book', 'The complete System Design Interview book by Alex Xu', 'pdf', '/resources/system-design-interview-book.pdf', 1),
(@course_id, 'System Design Cheat Sheet', 'Quick reference guide for system design concepts', 'pdf', '/resources/system-design-cheatsheet.pdf', 2),
(@course_id, 'Distributed Systems Lecture Series', 'MIT's lecture series on distributed systems', 'video', 'https://www.youtube.com/watch?v=cQP8WApzIQQ', 3);

-- Insert topics for System Design course
INSERT INTO topics (course_id, title, description, order_index) VALUES
(@course_id, 'Scale From Zero To Millions Of Users', 'Learn how to scale a system from a single server to a distributed architecture that can handle millions of users', 1),
(@course_id, 'Back-of-the-envelope Estimation', 'Master the art of quick calculations to estimate system capacity, performance, and resource requirements', 2),
(@course_id, 'System Design Interview Framework', 'A structured approach to tackle any system design problem in interviews or real-world scenarios', 3),
(@course_id, 'Design A Rate Limiter', 'Learn different algorithms and approaches to implement rate limiting in distributed systems', 4),
(@course_id, 'Design Consistent Hashing', 'Understand the principles of consistent hashing and its applications in distributed systems', 5),
(@course_id, 'Design A Key-value Store', 'Design a distributed key-value store with high availability and partition tolerance', 6),
(@course_id, 'Design A Unique ID Generator', 'Explore different approaches to generate unique IDs in distributed systems', 7),
(@course_id, 'Design A URL Shortener', 'Design a scalable URL shortening service like bit.ly', 8),
(@course_id, 'Design A Web Crawler', 'Design a distributed web crawler that can efficiently crawl billions of web pages', 9),
(@course_id, 'Design A Notification System', 'Design a scalable notification system that can handle different notification types and delivery channels', 10);

-- Get topic IDs
SELECT @topic1_id := id FROM topics WHERE course_id = @course_id AND title = 'Scale From Zero To Millions Of Users';
SELECT @topic2_id := id FROM topics WHERE course_id = @course_id AND title = 'Back-of-the-envelope Estimation';
SELECT @topic3_id := id FROM topics WHERE course_id = @course_id AND title = 'System Design Interview Framework';
SELECT @topic4_id := id FROM topics WHERE course_id = @course_id AND title = 'Design A Rate Limiter';

-- Insert lessons for Topic 1: Scale From Zero To Millions Of Users
INSERT INTO lessons (topic_id, title, content, xp_reward, order_index) VALUES
(@topic1_id, 'Single Server Setup', 'In this lesson, we will start with a simple setup: everything on one server. We will explore the components needed for a basic web application including web server, database, and application logic.\n\nA single server setup typically includes:\n- Web server (Nginx, Apache)\n- Application server\n- Database (MySQL, PostgreSQL)\n- Static content\n\nThis setup is simple but has significant limitations in terms of scalability and reliability.', 15, 1),

(@topic1_id, 'Database Replication', 'As your application grows, you need to separate the database from the web/application server. Database replication creates copies of the database to reduce the load on the primary database and improve read performance.\n\nWe will cover:\n- Primary-secondary replication\n- Primary-primary replication\n- Advantages and disadvantages of each approach\n- How to handle replication lag and consistency issues', 20, 2),

(@topic1_id, 'Caching Strategies', 'Caching is a technique to store frequently accessed data in memory to reduce database load and improve response times.\n\nIn this lesson, we will explore:\n- Different caching strategies (cache-aside, write-through, write-behind)\n- Cache invalidation techniques\n- Cache eviction policies (LRU, LFU, FIFO)\n- Distributed caching with tools like Redis and Memcached\n- CDN caching for static content', 20, 3),

(@topic1_id, 'Load Balancing', 'Load balancers distribute incoming traffic across multiple servers to ensure no single server bears too much load.\n\nWe will discuss:\n- Hardware vs. software load balancers\n- Load balancing algorithms (round-robin, least connections, IP hash)\n- Layer 4 vs. Layer 7 load balancing\n- Health checks and server pools\n- Sticky sessions and session persistence', 20, 4),

(@topic1_id, 'Database Sharding', 'As data grows, a single database server may not be sufficient. Sharding is a technique to horizontally partition data across multiple database servers.\n\nThis lesson covers:\n- Sharding strategies (hash-based, range-based, directory-based)\n- Challenges with sharding (joins, transactions, schema changes)\n- Consistent hashing for dynamic sharding\n- Sharding vs. partitioning', 25, 5),

(@topic1_id, 'Microservices Architecture', 'Breaking down a monolithic application into smaller, loosely coupled services can improve scalability and development velocity.\n\nWe will explore:\n- Microservices vs. monolithic architecture\n- Service discovery and registration\n- API gateway pattern\n- Inter-service communication (synchronous vs. asynchronous)\n- Challenges and best practices', 25, 6);

-- Insert lessons for Topic 2: Back-of-the-envelope Estimation
INSERT INTO lessons (topic_id, title, content, xp_reward, order_index) VALUES
(@topic2_id, 'Power of Two', 'Understanding powers of two is fundamental for system design calculations. In this lesson, we will learn how to work with powers of two and common size units.\n\nWe will cover:\n- Byte, Kilobyte, Megabyte, Gigabyte, Terabyte, Petabyte\n- Memory and storage conversions\n- Bandwidth calculations\n- Quick mental math techniques for powers of two', 15, 1),

(@topic2_id, 'Latency Numbers', 'Every system designer should know the approximate latency of various operations. This knowledge helps in making informed design decisions.\n\nIn this lesson, we will memorize and understand:\n- Memory access: ~100ns\n- SSD random read: ~100μs\n- Network round trip within same datacenter: ~1ms\n- Network round trip cross-continental: ~100ms\n- Disk seek: ~10ms\n- Reading 1MB sequentially from memory: ~10μs\n- Reading 1MB sequentially from SSD: ~1ms\n- Reading 1MB sequentially from disk: ~20ms', 20, 2),

(@topic2_id, 'Availability Calculations', 'System availability is typically measured in nines (e.g., 99.99% uptime). In this lesson, we will learn how to calculate system availability and understand the impact of downtime.\n\nWe will cover:\n- Calculating availability percentages\n- Understanding SLAs (Service Level Agreements)\n- Calculating availability for systems in series and parallel\n- Strategies to improve availability', 20, 3),

(@topic2_id, 'Traffic Estimation', 'Estimating traffic is crucial for capacity planning. In this lesson, we will learn techniques to estimate traffic for a given system.\n\nWe will cover:\n- QPS (Queries Per Second) calculations\n- DAU (Daily Active Users) to QPS conversion\n- Peak traffic estimation\n- Growth projections', 20, 4),

(@topic2_id, 'Storage Estimation', 'Calculating storage requirements helps in planning infrastructure needs. In this lesson, we will learn how to estimate storage for different types of data.\n\nWe will cover:\n- Text storage calculations\n- Image and video storage estimations\n- Compression considerations\n- Growth projections for storage needs', 20, 5);

-- Insert lessons for Topic 3: System Design Interview Framework
INSERT INTO lessons (topic_id, title, content, xp_reward, order_index) VALUES
(@topic3_id, 'Understanding Requirements', 'The first step in any system design interview is to clarify requirements. In this lesson, we will learn how to ask the right questions to understand what needs to be built.\n\nWe will cover:\n- Functional requirements: What the system should do\n- Non-functional requirements: Performance, scalability, reliability\n- Constraints and assumptions\n- Scale estimation (users, traffic, data)\n- Prioritizing requirements', 15, 1),

(@topic3_id, 'High-level Design', 'Once requirements are clear, the next step is to create a high-level design. This involves identifying the main components and their interactions.\n\nIn this lesson, we will learn how to:\n- Draw system diagrams\n- Identify key components (clients, servers, databases, caches)\n- Define APIs and data models\n- Discuss trade-offs at a high level', 20, 2),

(@topic3_id, 'Detailed Design', 'After establishing the high-level design, we dive deeper into specific components based on the interviewer's guidance.\n\nThis lesson covers:\n- Data storage solutions (SQL vs. NoSQL)\n- Caching strategies\n- Load balancing techniques\n- Handling concurrency and race conditions\n- Scaling strategies (vertical vs. horizontal)', 25, 3),

(@topic3_id, 'Bottlenecks and Improvements', 'Identifying potential bottlenecks and suggesting improvements demonstrates your critical thinking skills.\n\nIn this lesson, we will learn how to:\n- Identify single points of failure\n- Address performance bottlenecks\n- Improve availability and reliability\n- Handle edge cases\n- Discuss monitoring and alerting', 20, 4);

-- Insert lessons for Topic 4: Design A Rate Limiter
INSERT INTO lessons (topic_id, title, content, xp_reward, order_index) VALUES
(@topic4_id, 'Rate Limiting Fundamentals', 'Rate limiting is a technique to control the rate of requests a user or service can make to an API or service. In this lesson, we will understand the basics of rate limiting.\n\nWe will cover:\n- Why rate limiting is important\n- Types of rate limits (user-based, IP-based, endpoint-based)\n- Rate limiting metrics (requests per second, minute, hour)\n- Rate limiting headers and client communication', 15, 1),

(@topic4_id, 'Token Bucket Algorithm', 'The Token Bucket algorithm is a popular rate limiting algorithm that allows for bursts of traffic. In this lesson, we will learn how it works and how to implement it.\n\nWe will cover:\n- Token bucket concept and parameters\n- Implementation details\n- Advantages and disadvantages\n- Use cases and examples', 20, 2),

(@topic4_id, 'Leaky Bucket Algorithm', 'The Leaky Bucket algorithm is another rate limiting approach that processes requests at a constant rate. In this lesson, we will explore this algorithm and compare it with Token Bucket.\n\nWe will cover:\n- Leaky bucket concept and parameters\n- Implementation details\n- Advantages and disadvantages\n- Comparison with Token Bucket', 20, 3),

(@topic4_id, 'Fixed Window Counter', 'The Fixed Window Counter is a simple rate limiting algorithm that counts requests in fixed time windows. In this lesson, we will learn about this approach and its limitations.\n\nWe will cover:\n- Fixed window concept\n- Implementation details\n- The boundary problem\n- Advantages and disadvantages', 15, 4),

(@topic4_id, 'Sliding Window Log', 'The Sliding Window Log algorithm keeps track of timestamps for each request. In this lesson, we will learn how this approach provides more accurate rate limiting.\n\nWe will cover:\n- Sliding window log concept\n- Implementation details\n- Memory usage considerations\n- Advantages and disadvantages', 20, 5),

(@topic4_id, 'Sliding Window Counter', 'The Sliding Window Counter combines the Fixed Window Counter and Sliding Window Log approaches. In this lesson, we will learn how this hybrid approach works.\n\nWe will cover:\n- Sliding window counter concept\n- Implementation details\n- Smoothing techniques\n- Advantages and disadvantages', 20, 6),

(@topic4_id, 'Distributed Rate Limiting', 'Implementing rate limiting in a distributed environment presents additional challenges. In this lesson, we will learn how to design a distributed rate limiter.\n\nWe will cover:\n- Challenges in distributed environments\n- Using Redis for distributed rate limiting\n- Synchronization and consistency issues\n- Race conditions and their solutions\n- Performance considerations', 25, 7);

-- Insert key points for lessons
INSERT INTO key_points (lesson_id, content, order_index) VALUES
-- Single Server Setup key points
((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Single Server Setup'), 'A single server setup includes web server, application server, database, and file storage all on one machine', 1),
((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Single Server Setup'), 'This setup is simple but has limitations in scalability, reliability, and fault tolerance', 2),
((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Single Server Setup'), 'Common web servers include Nginx and Apache', 3),
((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Single Server Setup'), 'As traffic grows, this setup will quickly become a bottleneck', 4),

-- Database Replication key points
((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Database Replication'), 'Database replication creates copies of the database to improve read performance and reliability', 1),
((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Database Replication'), 'In primary-secondary replication, writes go to the primary and reads can be distributed across secondaries', 2),
((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Database Replication'), 'Replication lag can cause consistency issues in distributed systems', 3),
((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Database Replication'), 'Replication provides better fault tolerance but adds complexity to the system', 4),

-- Caching Strategies key points
((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Caching Strategies'), 'Caching stores frequently accessed data in memory to reduce database load', 1),
((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Caching Strategies'), 'Common caching strategies include cache-aside, write-through, and write-behind', 2),
((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Caching Strategies'), 'Cache invalidation is challenging and requires careful design', 3),
((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Caching Strategies'), 'Redis and Memcached are popular caching solutions', 4),
((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Caching Strategies'), 'CDNs can be used to cache static content closer to users', 5),

-- Rate Limiting Fundamentals key points
((SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Rate Limiting Fundamentals'), 'Rate limiting controls the rate of requests a client can make to an API', 1),
((SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Rate Limiting Fundamentals'), 'Rate limits can be based on user ID, IP address, or API endpoint', 2),
((SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Rate Limiting Fundamentals'), 'Common rate limit metrics include requests per second, minute, or hour', 3),
((SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Rate Limiting Fundamentals'), 'Rate limiting protects services from abuse, DoS attacks, and resource exhaustion', 4),

-- Token Bucket Algorithm key points
((SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Token Bucket Algorithm'), 'The Token Bucket algorithm uses tokens that are added to a bucket at a fixed rate', 1),
((SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Token Bucket Algorithm'), 'Each request consumes one or more tokens from the bucket', 2),
((SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Token Bucket Algorithm'), 'If the bucket is empty, requests are either delayed or rejected', 3),
((SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Token Bucket Algorithm'), 'Token Bucket allows for bursts of traffic up to the bucket size', 4);

-- Insert practice problems
INSERT INTO practice_problems (lesson_id, question, answer, explanation, difficulty, type, xp_value) VALUES
-- Single Server Setup practice problems
((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Single Server Setup'), 
'Which of the following is NOT typically part of a single server setup?', 
'Load balancer', 
'A single server setup typically includes a web server, application server, database, and file storage all on one machine. Load balancers are used in multi-server architectures to distribute traffic across multiple servers.', 
1, 'multiple_choice', 5),

((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Single Server Setup'), 
'What is the main limitation of a single server setup?', 
'Scalability', 
'While a single server setup has limitations in reliability, fault tolerance, and performance, the primary limitation is scalability. As traffic grows, a single server cannot handle the increased load, making scalability the biggest challenge.', 
1, 'multiple_choice', 5),

-- Database Replication practice problems
((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Database Replication'), 
'In primary-secondary replication, which server(s) can accept write operations?', 
'Only the primary server', 
'In primary-secondary replication, all write operations must go to the primary server, which then replicates the changes to the secondary servers. Secondary servers are read-only.', 
2, 'multiple_choice', 10),

((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Database Replication'), 
'What is replication lag?', 
'The delay between a write operation on the primary and its application on the secondary', 
'Replication lag refers to the time delay between when a write operation is completed on the primary database and when that change is applied to the secondary database. This lag can cause consistency issues in distributed systems.', 
2, 'multiple_choice', 10),

-- Rate Limiting Fundamentals practice problems
((SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Rate Limiting Fundamentals'), 
'Which of the following is NOT a common use case for rate limiting?', 
'Increasing database throughput', 
'Rate limiting is used to prevent abuse, protect against DoS attacks, manage resource usage, and ensure fair service. It does not directly increase database throughput; in fact, it intentionally limits throughput to protect the system.', 
1, 'multiple_choice', 5),

((SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Rate Limiting Fundamentals'), 
'If a service has a rate limit of 100 requests per minute, how many requests per second does this equate to?', 
'1.67', 
'To convert requests per minute to requests per second, divide by 60. So 100 requests per minute equals 100/60 = 1.67 requests per second.', 
2, 'numeric', 10),

-- Token Bucket Algorithm practice problems
((SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Token Bucket Algorithm'), 
'In a Token Bucket with a capacity of 10 tokens and a refill rate of 2 tokens per second, how long would it take to refill an empty bucket completely?', 
'5', 
'With a refill rate of 2 tokens per second and a bucket capacity of 10 tokens, it would take 10/2 = 5 seconds to refill an empty bucket completely.', 
3, 'numeric', 15),

((SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Token Bucket Algorithm'), 
'Which parameter of the Token Bucket algorithm controls the maximum burst size?', 
'Bucket capacity', 
'The bucket capacity determines how many tokens can be stored, which directly controls the maximum burst size. A larger bucket allows for larger bursts of traffic.', 
2, 'multiple_choice', 10);

-- Set up prerequisites between lessons
INSERT INTO prerequisites (lesson_id, prerequisite_lesson_id, order_index) VALUES
-- Database Replication prerequisites
((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Database Replication'), 
 (SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Single Server Setup'), 1),

-- Caching Strategies prerequisites
((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Caching Strategies'), 
 (SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Database Replication'), 1),

-- Load Balancing prerequisites
((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Load Balancing'), 
 (SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Caching Strategies'), 1),

-- Database Sharding prerequisites
((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Database Sharding'), 
 (SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Database Replication'), 1),
((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Database Sharding'), 
 (SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Load Balancing'), 2),

-- Microservices Architecture prerequisites
((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Microservices Architecture'), 
 (SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Load Balancing'), 1),
((SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Microservices Architecture'), 
 (SELECT id FROM lessons WHERE topic_id = @topic1_id AND title = 'Database Sharding'), 2),

-- Token Bucket Algorithm prerequisites
((SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Token Bucket Algorithm'), 
 (SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Rate Limiting Fundamentals'), 1),

-- Leaky Bucket Algorithm prerequisites
((SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Leaky Bucket Algorithm'), 
 (SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Rate Limiting Fundamentals'), 1),
((SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Leaky Bucket Algorithm'), 
 (SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Token Bucket Algorithm'), 2),

-- Distributed Rate Limiting prerequisites
((SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Distributed Rate Limiting'), 
 (SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Token Bucket Algorithm'), 1),
((SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Distributed Rate Limiting'), 
 (SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Leaky Bucket Algorithm'), 2),
((SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Distributed Rate Limiting'), 
 (SELECT id FROM lessons WHERE topic_id = @topic4_id AND title = 'Sliding Window Counter'), 3);
