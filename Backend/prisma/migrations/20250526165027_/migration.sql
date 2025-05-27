-- CreateTable
CREATE TABLE "Submission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "overallMood" TEXT NOT NULL,
    "overallMessage" TEXT NOT NULL,
    "totalActivities" INTEGER NOT NULL,
    "calmCount" INTEGER NOT NULL,
    "neutralCount" INTEGER NOT NULL,
    "stressedCount" INTEGER NOT NULL,
    "calmPercentage" INTEGER NOT NULL,
    "neutralPercentage" INTEGER NOT NULL,
    "stressedPercentage" INTEGER NOT NULL,
    "activitiesData" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Submission_userId_week_day_idx" ON "Submission"("userId", "week", "day");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_userId_week_day_key" ON "Submission"("userId", "week", "day");
