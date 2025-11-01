-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: bookstore
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bought_books`
--

DROP TABLE IF EXISTS `bought_books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bought_books` (
  `purchase_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `book_title` varchar(255) DEFAULT NULL,
  `author_name` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) NOT NULL,
  `book_condition` varchar(255) NOT NULL,
  `purchased_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `seller_id` int NOT NULL,
  PRIMARY KEY (`purchase_id`),
  UNIQUE KEY `purchase_id` (`purchase_id`),
  KEY `user_id` (`user_id`),
  KEY `bought_books_ibfk_2` (`seller_id`),
  CONSTRAINT `bought_books_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bought_books_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bought_books`
--

LOCK TABLES `bought_books` WRITE;
/*!40000 ALTER TABLE `bought_books` DISABLE KEYS */;
INSERT INTO `bought_books` VALUES (4,1,'Algorithm','James',90.00,'1748236256486.png','good','2025-06-03 06:39:44',1),(5,1,'Algorithm','James',90.00,'1748236256486.png','good','2025-06-03 06:50:57',1),(6,1,'Literator','jsafljf',1000.00,'1748260591485.png','fair','2025-06-03 06:50:57',1),(7,1,'Hello World Coding','Mario',190.00,'1748690709070.png','poor','2025-06-03 06:50:57',2),(8,1,'Algorithm','James',90.00,'1748236256486.png','good','2025-06-03 06:52:43',1),(9,1,'Literator','jsafljf',1000.00,'1748260591485.png','fair','2025-06-03 06:52:43',1),(10,1,'Hello World Coding','Mario',190.00,'1748690709070.png','poor','2025-06-03 06:52:43',2),(11,1,'Cooking Book','Young Man',65.78,'1748272077756.png','poor','2025-06-03 06:53:34',1),(12,1,'Cooking Book','Young Man',65.78,'1748272077756.png','poor','2025-06-03 06:54:26',1),(13,1,'Algorithm','James',90.00,'1748236256486.png','good','2025-06-13 08:44:20',1),(14,1,'Literator','jsafljf',1000.00,'1748260591485.png','fair','2025-06-13 08:44:20',1),(15,1,'Cooking Book','Young Man',65.78,'1748272077756.png','poor','2025-06-13 08:44:20',1),(16,1,'Hello World Coding','Mario',190.00,'1748690709070.png','poor','2025-06-13 08:44:20',2);
/*!40000 ALTER TABLE `bought_books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `purchase_id` int NOT NULL,
  `review_text` tinytext,
  `review_rating` int DEFAULT NULL,
  `review_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  UNIQUE KEY `uq_reviews_purchase_id` (`purchase_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`purchase_id`) REFERENCES `bought_books` (`purchase_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (6,4,'ALMOST GOOD',4,'2025-06-06 13:12:13'),(8,5,'THsi is very bad',3,'2025-06-07 02:20:05'),(10,6,'This is normal',4,'2025-06-07 02:28:18'),(11,8,'hai_tri Huy',3,'2025-06-07 02:32:38'),(12,11,'Good Food',3,'2025-06-07 02:56:02'),(13,9,'Sht seller\n',5,'2025-06-07 06:46:21'),(15,7,'very bad',2,'2025-06-13 08:41:55'),(16,12,'good\n',4,'2025-06-13 08:44:39');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shopping_cart`
--

DROP TABLE IF EXISTS `shopping_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shopping_cart` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `book_id` int NOT NULL,
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `seller_id` int NOT NULL,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `unique_user_book_cart` (`user_id`,`book_id`),
  KEY `book_id` (`book_id`),
  KEY `shopping_cart_ibfk_4` (`seller_id`),
  CONSTRAINT `shopping_cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `shopping_cart_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `user_books` (`book_id`) ON DELETE CASCADE,
  CONSTRAINT `shopping_cart_ibfk_4` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shopping_cart`
--

LOCK TABLES `shopping_cart` WRITE;
/*!40000 ALTER TABLE `shopping_cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `shopping_cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_books`
--

DROP TABLE IF EXISTS `user_books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_books` (
  `book_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `isbn` varchar(20) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `book_condition` varchar(12) NOT NULL,
  `imageFilename` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`book_id`),
  UNIQUE KEY `isbn` (`isbn`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_books_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_books`
--

LOCK TABLES `user_books` WRITE;
/*!40000 ALTER TABLE `user_books` DISABLE KEYS */;
INSERT INTO `user_books` VALUES (3,1,'Algorithm','Samsung','jidsfsjaflj;',65.90,'like-new','1748271905188.png','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum rutrum nisl non mi pulvinar interdum. Vestibulum metus tortor, maximus sed lacus finibus, dapibus malesuada arcu. Proin sollicitudin semper faucibus. Sed eget tincidunt metus, sit amet iaculis magna. Pellentesque lobortis vulputate magna, id varius nibh vulputate eget. Vivamus nec sapien nibh. Proin vitae porttitor elit. Vivamus ut lorem sit amet diam pretium pretium id eu arcu.','2025-05-26 15:05:05','2025-05-26 15:05:05'),(5,1,'Algorithm','Sim','djkfjsl',66.00,'fair','1748690082374.png','sdfsadf','2025-05-31 11:14:42','2025-05-31 11:14:42');
/*!40000 ALTER TABLE `user_books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `address` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `gender` enum('male','female','prefer_not_to_say') DEFAULT 'prefer_not_to_say',
  `dateofbirth` date DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) DEFAULT '0',
  `registered_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'hai_tri','90 James Street','hai@gmail','2103901280','male','2007-03-14','/images/user_profile_photos/user_1.png','$2b$10$x1BR7ImG0G8DA8/HGyWMhed5G8YkrP7vI66Y0d7HzotvdfFZDiTzi',1,'2025-05-26 05:00:04','2025-06-13 08:59:07'),(2,'tri_hai',NULL,'1234@aaa',NULL,'prefer_not_to_say',NULL,'/images/user_profile_photos/Default.jpg','$2b$10$118k2TCjYe5rA1x6ztr3qevQf3DqdyY6n9noSH.myUpSaVgpCgsiG',0,'2025-05-31 11:24:33','2025-05-31 11:28:09'),(3,'rahul',NULL,'saha@gmail.com',NULL,'prefer_not_to_say',NULL,'/images/user_profile_photos/Default.jpg','$2b$10$VkPgg7eXy/jzyK.nRlJbO.1qxaR3ZkjVKkRcyFP6BIALvlnsH.nQe',0,'2025-06-13 07:46:57','2025-06-13 07:49:05');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `wishlist_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `external_book_id` varchar(255) NOT NULL,
  `book_title` varchar(255) DEFAULT NULL,
  `author_name` varchar(255) DEFAULT NULL,
  `thumbnail_url` varchar(512) DEFAULT NULL,
  `added_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `removed_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`wishlist_id`),
  UNIQUE KEY `unique_user_book` (`user_id`,`external_book_id`),
  CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
INSERT INTO `wishlist` VALUES (67,1,'UcgMWDfca0EC','Algorithmic Puzzles','Anany Levitin,Maria Levitin','http://books.google.com/books/content?id=UcgMWDfca0EC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api','2025-05-26 15:06:55',NULL);
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-13 18:32:59
