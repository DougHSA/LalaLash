"use server";

import { db } from "@/app/_lib/prisma"
import { endOfDay, startOfDay } from "date-fns"

export const getBookings = async (date: Date, employeeId:string, establishmentId: string) =>{
    const bookings = await db.booking.findMany({
        where:{
            date:{
                lte: endOfDay(date),
                gte: startOfDay(date),
            },
            establishmentId,
            employeeId,
            serviceId:{
                not: null
            }
        },
        include:{
            service:true,
            employee:true
        }
    });

    return bookings;
}
export const getOriginalDayTime = async (date: Date, employeeId:string, establishmentId: string) =>{
    const bookings = await db.booking.findMany({
        where:{
            date:{
                lte: endOfDay(date),
                gte: startOfDay(date),
            },
            establishmentId,
            employeeId,
            serviceId:{
                equals: null
            }
        }
    });

    return bookings;
}