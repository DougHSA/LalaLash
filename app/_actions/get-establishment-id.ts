"use server";

import { db } from "../_lib/prisma"

export const getEstablishmentId = async (email: string) => {
    if(!email)
        return false;
    const establishmentManager = await db.manager.findFirst({
        where:{
            email: email
        },
        include:{
            establishments:true
        }
    });
    if(!establishmentManager)
        return null;
    return establishmentManager?.establishments[0].establishmentId;
}