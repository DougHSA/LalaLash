import { addMinutes, format, setHours, setMinutes } from "date-fns";


export function generateDayTimeList(date: Date): string[] {
    const startTime = date.getDate() ===(new Date()).getDate() && date.getMonth() ===(new Date()).getMonth() && date.getFullYear() ===(new Date()).getFullYear() ? 
    new Date() :
    setMinutes(setHours(date, 9), 0);
    const endTime = setMinutes(setHours(date, 21), 0);
    const interval = 15;
    const timeList : string[] = [];
    let currentTime = startTime;
    while (currentTime <= endTime){
        timeList.push(format(currentTime, "HH:mm"));
        currentTime = addMinutes(currentTime, interval);
    }

    return timeList;
}