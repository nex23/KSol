CREATE TABLE `collaborators` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kerMesseId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('cook','seller','distributor') NOT NULL,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `collaborators_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deliveries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`saleId` int NOT NULL,
	`distributorId` int NOT NULL,
	`deliveryDate` datetime,
	`status` enum('pending','in_transit','delivered') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `deliveries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dishes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kerMesseId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100) NOT NULL,
	`priceInBs` int NOT NULL,
	`quantityAvailable` int NOT NULL,
	`quantitySold` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dishes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ingredientDonations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ingredientId` int NOT NULL,
	`donorName` varchar(255) NOT NULL,
	`donorEmail` varchar(320),
	`donorPhone` varchar(20),
	`quantityDonated` int NOT NULL,
	`donatedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ingredientDonations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ingredients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kerMesseId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`quantity` varchar(100) NOT NULL,
	`unit` varchar(50) NOT NULL,
	`quantityNeeded` int NOT NULL,
	`quantityDonated` int NOT NULL DEFAULT 0,
	`isDonated` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ingredients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `kermesses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organizerId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`beneficiaryName` varchar(255) NOT NULL,
	`beneficiaryReason` text NOT NULL,
	`contactPhone` varchar(20) NOT NULL,
	`contactEmail` varchar(320),
	`eventDate` datetime NOT NULL,
	`status` enum('planning','active','completed','cancelled') NOT NULL DEFAULT 'planning',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `kermesses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `saleItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`saleId` int NOT NULL,
	`dishId` int NOT NULL,
	`quantity` int NOT NULL,
	`pricePerUnitInBs` int NOT NULL,
	`subtotalInBs` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `saleItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sales` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kerMesseId` int NOT NULL,
	`sellerId` int NOT NULL,
	`buyerName` varchar(255) NOT NULL,
	`buyerPhone` varchar(20),
	`totalAmountInBs` int NOT NULL,
	`status` enum('pending','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`saleDate` datetime NOT NULL DEFAULT '2025-11-14 15:41:28.195',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sales_id` PRIMARY KEY(`id`)
);
