CREATE TABLE `dishImages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dishId` int NOT NULL,
	`imageUrl` text NOT NULL,
	`imageKey` varchar(255) NOT NULL,
	`uploadedBy` int NOT NULL,
	`caption` text,
	`isMainImage` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dishImages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `deliveries` MODIFY COLUMN `deliveryDate` timestamp;--> statement-breakpoint
ALTER TABLE `dishes` MODIFY COLUMN `category` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `ingredients` MODIFY COLUMN `quantity` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `ingredients` MODIFY COLUMN `isDonated` int NOT NULL;--> statement-breakpoint
ALTER TABLE `ingredients` MODIFY COLUMN `isDonated` int NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `kermesses` MODIFY COLUMN `eventDate` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `sales` MODIFY COLUMN `saleDate` timestamp NOT NULL DEFAULT (now());