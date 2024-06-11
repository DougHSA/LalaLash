"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar } from "../../_components/ui/calendar";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { Booking, Employee } from "@prisma/client";
import { getBookings, getOriginalDayTime } from "../_actions/get-bookings";
import { addDays, addMinutes, format, setHours, setMinutes } from "date-fns";
import { generateDayTimeList } from "../_helpers/hours";
import { ptBR } from "date-fns/locale";
import { Button } from "@/app/_components/ui/button";
import { ChevronLeftIcon, Loader2 } from "lucide-react";
import EmployeeItem from "@/app/establishments/[id]/_components/employee-item";
import { getEmployees } from "../_actions/get-employees";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/app/_components/ui/alert-dialog";
import { toast } from "sonner";
import { toggleTime } from "../_actions/update-available-time";
import { getUserId } from "../_actions/get-user-id";

interface SettingsEstablishmentPageProps{
    params: {
        id: string;
      };
}
const SettingsEstablishmentPage = ({params}: SettingsEstablishmentPageProps) => {
    const router = useRouter();
    const {data} = useSession();
    const [date,setDate] = useState<Date | undefined>(undefined);
    const [employee, setEmployee] = useState<Employee | undefined>(undefined);
    const [employees, setEmployees] = useState<Employee[] | undefined>([]);
    const [dayBookings, setDayBookings] = useState<any[]>([]);
    const [hours, setHours] = useState<String[]>([]);
    const [hoursModified, setHoursModified] = useState<String[]>([]);
    const [originalTime, setOriginalTime] = useState<Booking[]>([]);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    
	const handleAlterClick = async () => {
		try {
            const promises: Promise<void>[] = [];
            if(!data?.user?.email)
                return;
            const userId = await getUserId(data?.user?.email);
            if(!userId)
                return;
			setIsDeleteLoading(true);
            
            if(!date || !employee)
                return;
            const dateOnly = format(date, "dd/MM/yyyy");
            const [d,M,y] = dateOnly.split('/').map(Number); 
            
            hoursModified.forEach((hour)=>{
                const[h,m] = hour.split(':').map(Number); 
                const dateAndHour = new Date(y, M-1, d, h, m);
                if(originalTime.some((time)=>format(time.date, "dd/MM/yyyy HH:mm") === format(dateAndHour,"dd/MM/yyyy HH:mm"))){
                    promises.push(toggleTime(dateAndHour,employee.id!, userId, params.id, false));
                }
                else{
                    promises.push(toggleTime(dateAndHour,employee.id!, userId, params.id, true));
                }


            })
            await Promise.all(promises);
            setHoursModified([]);
            setOriginalTime(await getOriginalDayTime(date, employee?.id!, params.id!));
			toast.success("Horários alterados na agenda!");
		} catch (error) {
			console.log(error);
		} finally {
			setIsDeleteLoading(false);
		}
	};

    
    useEffect(()=>{
        if(!data?.user || !params?.id)
            return;

        const getAllEmployees = async()=>{
            const emp = await getEmployees(params.id!);
            if(!emp)
                return;
            setEmployees(emp);
        }
        if(!employees || employees.length===0)    
            getAllEmployees();
        if(!date){
            return;
        }
        
        const refreshAvailableHours = async () =>{
            if(!employee || !date)
                return;
            const _dayBookings = await getBookings(date, employee.id, params.id);
            setDayBookings(_dayBookings);
        };
        refreshAvailableHours();
    },[data?.user, date, employee, employees, employees?.length, params.id]);

    const handleDateClick = async (date: Date | undefined) =>{
        setHours([]);
        setDate(date);
        if(!date)
            return;
        const originalTimes = await getOriginalDayTime(date, employee?.id!, params.id!);
        setOriginalTime(originalTimes);
        const originalTimeHours = originalTimes.map(originalTime=> format(originalTime.date, "HH:mm"));
        setHours(originalTimeHours);
    }

    const handleHourClick = (time: string) => {
        if (hours.includes(time)) {
            setHours(hours.filter((hour) => hour !== time));
        } else {
            setHours([...hours, time]);
        }
        if(hoursModified.includes(time)){
            setHoursModified(hoursModified.filter((hour) => hour !== time));
        }
        else{
            setHoursModified([...hoursModified, time]);
        }
    }
    const handleBackClick = () =>{
        router.back();
    }

	const handleEmployeeClick = async (employee: Employee) => {
		setEmployee(employee);
        setHoursModified([]);
        if(!date)
            return;
        setHours([]);
        const originalTimes = await getOriginalDayTime(date, employee?.id!, params.id!);
        setOriginalTime(originalTimes);
        const originalTimeHours = originalTimes.map(originalTime=> format(originalTime.date, "HH:mm"));
        setHours(originalTimeHours);

	}

    const timeList = useMemo(()=>{
        if(!date){
            return [];
        }
        return generateDayTimeList(date).filter(time => {
            const timeHour = Number(time.split(':')[0]);
            const timeMinute = Number(time.split(':')[1]);
            const dateCompare = date;
            dateCompare.setHours(timeHour,timeMinute,0,0);
            const booking = dayBookings.find(booking => {
                const startTime = booking.date;
                const endTime = addMinutes(booking.date, booking.service?.timeSpend ?? 1);
                const isBetweenTimes = dateCompare >=  startTime && dateCompare <= endTime; 
                return isBetweenTimes;
            });
            if(!booking){
                return true;
            }
            return false;
        })
    },[date, dayBookings]);
    
    return (
        <div>
            <div className="flex m-6 gap-3 items-center">
                <Button onClick={handleBackClick} size="icon" variant="outline" className=" p-3">
                    <ChevronLeftIcon/>
                </Button> 
                <h2 className="text-xl">Voltar</h2>
            </div>
             

            <div className="flex gap-3 overflow-x-auto py-6 px-5 border-t border-solid border-secondary [&::-webkit-scrollbar]:hidden">

                {employees && employees.length > 0 ? employees?.map((b) => (
                    <EmployeeItem onClick={() => handleEmployeeClick(b)} key={b.id} employee={b} className={employee === b ? "border border-primary bg-primary text-primary-foreground hover:bg-primary/90" : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"} />
                )) : 
                    <h2 className="font-bold">Não há profissionais disponíveis</h2>												
                }
            </div>
      
            
            
            <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateClick}
                className=""
                fromDate={addDays(new Date(), 1)}
                locale={ptBR}
                styles={{
                    head_cell: {
                        width: "100%",
                        textTransform: "capitalize",
                    },
                    cell: {
                        width: "100%",
                    },
                    button: {
                        width: "100%",
                    },
                    nav_button_next: {
                        width: "32px",
                        height: "32px",
                    },
                    nav_button_previous: {
                        width: "32px",
                        height: "32px",
                    },
                    caption: {
                        textTransform: "capitalize",
                    },
                    month: {
                        width: "100%",
                    },
                }}
            />

            {employee && date && (
                <>
                <div className="flex gap-3 overflow-x-auto py-6 px-5 border-t border-solid border-secondary [&::-webkit-scrollbar]:hidden">
                    {timeList.map((time) => (
                        <Button
                            onClick={() => handleHourClick(time)}
                            variant={hours.includes(time) ? "default" : "outline"}
                            className="rounded-full"
                            key={time}
                        >
                            {time}
                        </Button>
                    ))}
                </div>
                <div className="flex px-5 py-6 justify-center w-full">
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <Button
                                disabled={isDeleteLoading || hoursModified.length === 0 || !employee}
                                className="w-full"
                                variant="default"
                            >
                                Aplicar Alterações
                            </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="w-[90%]">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-center">
                                    Aplicar Alterações
                                </AlertDialogTitle>

                                <AlertDialogDescription className="text-center">
                                    Tem certeza que deseja alterar esses horários da agenda?
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter className="flex-row gap-3">
                                <AlertDialogCancel className="w-full mt-0">
                                    Voltar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    disabled={isDeleteLoading}
                                    onClick={handleAlterClick}
                                    className="w-full"
                                >
                                    {isDeleteLoading && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Confirmar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                </>
            )}
        </div>
    );
}
 
export default SettingsEstablishmentPage;