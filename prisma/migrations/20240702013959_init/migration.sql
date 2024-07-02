-- CreateTable
CREATE TABLE "UserCredential" (
    "id" TEXT NOT NULL,
    "raw_id" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "type" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "UserCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "email" TEXT NOT NULL,
    "id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "sid" TEXT NOT NULL,
    "sess" JSONB NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sid")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserCredential_email_key" ON "UserCredential"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
