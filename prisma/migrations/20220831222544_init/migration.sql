-- CreateTable
CREATE TABLE "Network" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Network_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Show" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imdbRating" INTEGER NOT NULL,
    "networkId" TEXT NOT NULL,

    CONSTRAINT "Show_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_NetworkToPackage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_NetworkToPackage_AB_unique" ON "_NetworkToPackage"("A", "B");

-- CreateIndex
CREATE INDEX "_NetworkToPackage_B_index" ON "_NetworkToPackage"("B");

-- AddForeignKey
ALTER TABLE "Show" ADD CONSTRAINT "Show_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "Network"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NetworkToPackage" ADD CONSTRAINT "_NetworkToPackage_A_fkey" FOREIGN KEY ("A") REFERENCES "Network"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NetworkToPackage" ADD CONSTRAINT "_NetworkToPackage_B_fkey" FOREIGN KEY ("B") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;
