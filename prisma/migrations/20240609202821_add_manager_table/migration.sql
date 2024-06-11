-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "email" TEXT;

-- CreateTable
CREATE TABLE "ManagerEstablishment" (
    "id" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "establishmentId" TEXT NOT NULL,

    CONSTRAINT "ManagerEstablishment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manager" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ManagerEstablishment" ADD CONSTRAINT "ManagerEstablishment_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagerEstablishment" ADD CONSTRAINT "ManagerEstablishment_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Establishment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
