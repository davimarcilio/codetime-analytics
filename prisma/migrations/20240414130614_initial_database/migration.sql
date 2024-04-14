-- CreateTable
CREATE TABLE "Records" (
    "id" UUID NOT NULL,
    "editor" VARCHAR(100) NOT NULL,
    "platform" VARCHAR(100) NOT NULL,
    "project" VARCHAR(250) NOT NULL,
    "relative_file" VARCHAR(500) NOT NULL,
    "language" VARCHAR(100) NOT NULL,
    "event_time" BIGINT NOT NULL,

    CONSTRAINT "Records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Records_event_time_relative_file_key" ON "Records"("event_time", "relative_file");
