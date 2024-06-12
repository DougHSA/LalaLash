"use client"

import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/app/_components/ui/sheet";
import { Employee, Establishment, Booking, Service } from "@prisma/client";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { generateDayTimeList } from "../_helpers/hours";
import { ptBR } from "date-fns/locale";
import { addDays, addMinutes, format, setHours, setMinutes } from "date-fns";
import { saveBooking } from "../_actions/save-booking";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getDayBookings } from "../_actions/get-day-bookings";
import EmployeeItem from "./employee-item";
import { createCalendarEvent } from "../_actions/create-event";


// Adicione esta declaração dentro do arquivo onde você importou o next-auth/react
declare module "next-auth/react" {
	interface Session {
	  user: {
		name?: string | null | undefined;
		email?: string | null | undefined;
		image?: string | null | undefined;
		accessToken: string; // Adicione accessToken aqui
	  };
	}
  }
interface ServiceItemProps {
    establishment: Establishment;
    service: Service;
	employees: Employee[];
    isAuthenticated?: boolean;
}

const ServiceItem = ({service, establishment, employees, isAuthenticated}:ServiceItemProps) => {
    const router = useRouter();
    const {data} = useSession();
    const [date,setDate] = useState<Date | undefined>(undefined);
    const [employee, setEmployee] = useState<Employee | undefined>(undefined);
    const [hour,setHour] = useState<String | undefined>();
    const [submitIsLoading, setSubmitIsLoading] = useState(false);
    const [sheetIsOpen, setSheetIsOpen] = useState(false);
    const [dayBookings, setDayBookings] = useState<any[]>([]);
	
    useEffect(()=>{
        if(!date){
            return;
        }
        const refreshAvailableHours = async () =>{
			if(!employee)
				return;
			const _dayBookings = await getDayBookings(date, employee.id, establishment.id);
			setDayBookings(_dayBookings);
			
        };
        refreshAvailableHours();
    },[date, establishment.id, employee]);

    const handleDateClick = (date:Date | undefined) =>{
        setDate(date);
        setHour(undefined);
		setEmployee(undefined);
    }

    const handleHourClick = (time: string) => {
        setHour(time);
    }

    const handleBookingSubmit = async () => {
        setSubmitIsLoading(true);
        try{
            if (!hour || !date || !employee || !data?.user){
                throw new Error("Selecione o(a) profissional, data e hora para agendar.");
            }

            const dateHour = Number(hour.split(':')[0]);
            const dateMin = Number(hour.split(':')[1]);
            const newDate = setMinutes(setHours(date,dateHour),dateMin);
            const booking = await saveBooking({
                serviceId: service.id,
                establishmentId: establishment.id,
                date: newDate,
                userId: (data.user as any).id,
				employeeId: employee.id, 
            });
			console.log(booking);
			//await createCalendarEvent(booking!);
            setSheetIsOpen(false);
            setHour(undefined);
            setDate(undefined);
            toast("Reserva realizada com sucesso!", {
                description: format(newDate, "'Para' dd 'de' MMMM 'às' HH':'mm'.'",{
                    locale: ptBR
                }),
                action:{
                    label:"Visualizar",
                    onClick:()=> router.push("/bookings/")
                },
            })
        }
        catch(error){
            console.log(error);
        }
        finally{
            setSubmitIsLoading(false);
        }
    }
    const handleBookingClick = () => {
        if(!isAuthenticated){
            return signIn("google");
        }
    }

	const handleEmployeeClick = (employee: Employee) => {
		setHour(undefined);
		setEmployee(employee);
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
			<Card>
				<CardContent className="p-4 w-full">
					<div>
						<div className="flex gap-4 items-center w-full">
							<div className="relative min-h-[100px] min-w-[100px] max-h-[100px] max-w-[100px]">
								<Image
									src={service.imageUrl}
									fill
									alt={service.name}
									style={{
										objectFit: "cover",
									}}
									className="rounded-lg"
								/>
							</div>
							<div className="flex flex-col w-full ">
								<h2 className="font-bold">{service.name}</h2>
								<p className="text-sm text-gray-400 mb-2">{service.description}</p>
								<p className="text-sm text-gray-400">{`${service.timeSpend} minutos`}</p>
							</div>
						</div>
						<div className="flex items-center justify-around mt-3">
								<p className="text-primary text-sm font-bold">
									{Intl.NumberFormat("pt-BR", {
										style: "currency",
										currency: "BRL",
									}).format(Number(service.price))}
								</p>
								<Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
									<SheetTrigger asChild>
										<Button onClick={handleBookingClick} variant="secondary">
											Reservar
										</Button>
									</SheetTrigger>
									<SheetContent className="p-0 overflow-y-auto">
										<SheetHeader className="text-left px-5 py-4 border-b border-solid border-secondary">
											<SheetTitle>Fazer Reserva</SheetTitle>
										</SheetHeader>
										<div className="pt-3 pb-6 w-full">
											<Calendar
												mode="single"
												selected={date}
												onSelect={handleDateClick}
												className=""
												fromDate={new Date()}
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
										</div>

										{date && (
											<div className="flex gap-3 overflow-x-auto py-6 px-5 border-t border-solid border-secondary [&::-webkit-scrollbar]:hidden">

												{employees.length > 0 ? employees.map((b) => (
													<EmployeeItem onClick={() => handleEmployeeClick(b)} key={b.id} employee={b} className={employee === b ? "border border-primary bg-primary text-primary-foreground hover:bg-primary/90" : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"} />
												)) : 
													<h2 className="font-bold">Não há profissionais disponíveis</h2>												
												}
											</div>
										)}

										{employee && (
											<div className="flex gap-3 overflow-x-auto py-6 px-5 border-t border-solid border-secondary [&::-webkit-scrollbar]:hidden">
												{timeList.map((time) => (
													<Button
														onClick={() => handleHourClick(time)}
														variant={hour === time ? "default" : "outline"}
														className="rounded-full"
														key={time}
													>
														{time}
													</Button>
												))}
											</div>
										)}

										<div className="py-6 px-5 border-t border-solid border-secondary">
											<Card>
												<CardContent className="p-3 gap-3 flex flex-col">
													<div className="flex justify-between">
														<h2 className="font-bold">{service.name}</h2>
														<h3 className="font-bold text-sm">
															{" "}
															{Intl.NumberFormat("pt-BR", {
																style: "currency",
																currency: "BRL",
															}).format(Number(service.price))}
														</h3>
													</div>

													{date && (
														<div className="flex justify-between">
															<h3 className="text-gray-400 text-sm">Data</h3>
															<h4 className="text-sm capitalize">
																{format(date, "dd 'de' MMMM", {
																	locale: ptBR,
																})}
															</h4>
														</div>
													)}

													{hour && (
														<div className="flex justify-between">
															<h3 className="text-gray-400 text-sm">Horário</h3>
															<h4 className="text-sm capitalize">{hour}</h4>
														</div>
													)}

													<div className="flex justify-between">
														<h3 className="text-gray-400 text-sm">Tempo</h3>
														<h4 className="text-sm capitalize">{`${service.timeSpend} minutos`}</h4>
													</div>

													{employee && (
														<div className="flex justify-between">
															<h3 className="text-gray-400 text-sm">
																Profissional
															</h3>
															<h4 className="text-sm capitalize">
																{employee?.name}
															</h4>
														</div>
													)}

													<div className="flex justify-between">
														<h3 className="text-gray-400 text-sm">
															Estabelecimento
														</h3>
														<h4 className="text-sm capitalize">
															{establishment.name}
														</h4>
													</div>

													<SheetFooter>
														<Button
															onClick={handleBookingSubmit}
															disabled={!hour || !date || submitIsLoading}
															className="px-5"
														>
															{submitIsLoading && (
																<Loader2 className="mr-2 h-4 w-4 animate-spin" />
															)}
															Confirmar Reserva
														</Button>
													</SheetFooter>
												</CardContent>
											</Card>
										</div>
									</SheetContent>
								</Sheet>
							</div>
					</div>
				</CardContent>
			</Card>
		);
}
 
export default ServiceItem;