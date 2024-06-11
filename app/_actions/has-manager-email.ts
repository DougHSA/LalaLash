"use server";

import { db } from "../_lib/prisma"

export const hasManagerEmail = async (email: string) => {
    if(!email)
        return false;
    const hasEmail = await db.manager.count({
        where:{
            email: email
        }
    })
    return hasEmail > 0;
}