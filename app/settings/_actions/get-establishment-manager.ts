"use server";

import { db } from "@/app/_lib/prisma";


export const getEstablishmentManager = async (managerEmail: string) => {
    const managerEstablishments = await db.manager.findFirst({
        where:{
            email: managerEmail,
        },
        include:{
            establishments:{
                include:{
                    establishment:true
                }
            }
        }
    })
    if(!managerEstablishments)
        return null;
    return managerEstablishments;
}