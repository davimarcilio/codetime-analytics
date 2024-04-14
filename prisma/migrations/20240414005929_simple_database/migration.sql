-- CreateTable
CREATE TABLE `Records` (
    `id` VARCHAR(191) NOT NULL,
    `editor` VARCHAR(100) NOT NULL,
    `platform` VARCHAR(100) NOT NULL,
    `project` VARCHAR(250) NOT NULL,
    `relative_file` VARCHAR(500) NOT NULL,
    `language` VARCHAR(100) NOT NULL,
    `event_time` VARCHAR(14) NOT NULL,

    UNIQUE INDEX `Records_event_time_relative_file_key`(`event_time`, `relative_file`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
