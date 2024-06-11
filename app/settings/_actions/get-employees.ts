"use server";

import { db } from "@/app/_lib/prisma"

export const getEmployees = async (establishmentId: string) =>{
    const employees = await db.employee.findMany({
        where:{
            establishmentId: establishmentId
        }
    });

    return employees;
}