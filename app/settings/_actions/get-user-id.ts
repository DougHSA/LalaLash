"use server";

import { db } from "@/app/_lib/prisma"

export const getUserId = async (email: string) =>{
    const user = await db.user.findFirst({
        where:{
            email
        }
    });

    return user?.id;
}