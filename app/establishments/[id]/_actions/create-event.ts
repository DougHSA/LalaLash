"use server";

import { authOptions } from "@/app/_lib/auth";
import { db } from "@/app/_lib/prisma";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import { google } from "googleapis";
import { getServerSession } from "next-auth";

export const createCalendarEvent = async (booking?: Prisma.BookingGetPayload<{
    include:{
        service:true,
        employee:true,
        establishment:true,
    }
}>) => {
    if(!booking)
        return;
    const session = await getServerSession(authOptions);
    const user = db.user.findUnique({
        where:{
            id: booking.userId
        }
    });
    const calendar = google.calendar('v3');
    const startTime = booking.date;
    const endTime = booking.date;
    endTime.setMinutes(booking.date.getMinutes() + booking.service?.timeSpend!);

    const event = {
        start: {
            dateTime: format(startTime, "yyyy-MM-ddTHH:mm"),
            timeZone: "America/Sao_Paulo"
        },
        end: {
            dateTime: format(endTime, "yyyy-MM-ddTHH:mm"),
            timeZone: "America/Sao_Paulo"
        },
        attendess:[
            {
                displayName: session?.user?.name,
                email: session?.user?.email
            },
            {
                displayName: booking.employee.name,
                email: booking.employee.email
            }
        ],
        reminders: {
        useDefault: false,
        overrides: [
            {'method': 'popup', 'minutes': 24 * 60},
            {'method': 'popup', 'minutes': 30},
        ],
        },
        location: booking.establishment.address,
        summary: booking.service?.name,
        description: booking.service?.description
    }
    
    // calendar.events.insert({
    //     auth: authGoogle,
    //     calendarId: 'primary',
    //     requestBody: event
    // }, function(err: string, event: { htmlLink: any; }) {
    //     if (err) {
    //     console.log('There was an error contacting the Calendar service: ' + err);
    //     return;
    //     }
    //     console.log('Event created: %s', event.htmlLink);
    // });
}
