-- MySQL dump for order_management database

CREATE DATABASE IF NOT EXISTS order_management;
USE order_management;

-- Customers table
CREATE TABLE IF NOT EXISTS `Customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `phone` varchar(15) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Products table
CREATE TABLE IF NOT EXISTS `Products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orders table
CREATE TABLE IF NOT EXISTS `Orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customerId` int NOT NULL,
  `totalAmount` decimal(10,2) NOT NULL,
  `status` enum('placed','cancelled') DEFAULT 'placed',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `customerId` (`customerId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customerId`) REFERENCES `Customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- OrderItems table
CREATE TABLE IF NOT EXISTS `OrderItems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  KEY `productId` (`productId`),
  CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `Orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `Products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample Data
INSERT INTO `Customers` (`name`, `email`, `phone`, `createdAt`, `updatedAt`) VALUES
('Ganesh Saini', 'ganesh@example.com', '9876543210', NOW(), NOW()),
('Rahul Sharma', 'rahul@example.com', '9876543211', NOW(), NOW());

INSERT INTO `Products` (`name`, `price`, `stock`, `createdAt`, `updatedAt`) VALUES
('Laptop', 50000.00, 10, NOW(), NOW()),
('Mouse', 500.00, 50, NOW(), NOW()),
('Keyboard', 1000.00, 30, NOW(), NOW());