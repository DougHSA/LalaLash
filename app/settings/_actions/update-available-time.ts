"use server";

import { db } from "@/app/_lib/prisma"

export const toggleTime = async (date: Date, employeeId:string, userId: string, establishmentId: string, create: Boolean, serviceId?: string,) =>{

    if(create){
        await db.booking.create({
            data: {
                employeeId: employeeId,
                establishmentId: establishmentId,
                serviceId: serviceId,
                userId: userId,
                date: date
            }
        });
    }
    else{
        const booking = await db.booking.findFirst({
            where:{
                employeeId,
                date:{
                    equals: date
                }
            }
        });
        if (!booking){
            return;
        }
        await db.booking.delete({
            where:{
                id: booking.id
            }
        })
    }
    return;
}