"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

interface SaveBookingParams{
    establishmentId: string;
    serviceId: string;
    userId: string;
    date: Date;
    employeeId: string;
}

export const saveBooking = async (params: SaveBookingParams) => {
    const bookingCreated = await db.booking.create({
        data:{
            employeeId: params.employeeId,
            establishmentId: params.establishmentId,
            serviceId: params.serviceId,
            userId: params.userId,
            date: params.date
        }
    });
    const booking = await db.booking.findUnique({
        where:{
            id: bookingCreated.id
        },
        include:{
            service:true,
            employee:true,
            establishment:true,
        }
    });

    revalidatePath("/bookings");
    return booking;
}

