"use client";

import { Booking, Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./ui/sheet";
import Image from "next/image";
import { Button } from "./ui/button";
import { cancelBooking } from "../_actions/cancel-booking";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./ui/alert-dialog";

interface BookignItemProps {
	booking: Prisma.BookingGetPayload<{
		include: {
			service: true;
			establishment: true;
		};
	}>;
}

const BookingItem = ({ booking }: BookignItemProps) => {
	const [isDeleteLoading, setIsDeleteLoading] = useState(false);
	const isBookingConfirmed = isFuture(booking?.date);

	const handleCancelClick = async () => {
		try {
			setIsDeleteLoading(true);
			await cancelBooking(booking.id);
			toast.success("Reserva cancelada com sucesso!");
		} catch (error) {
			console.log(error);
		} finally {
			setIsDeleteLoading(false);
		}
	};

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Card className="min-w-full">
					<CardContent className="py-0 px-0 flex">
						<div className="flex flex-col gap-2 py-5 pl-5 flex-[3]">
							<Badge
								className="w-fit"
								variant={isBookingConfirmed ? "default" : "secondary"}
							>
								{isBookingConfirmed ? "Confirmado" : "Finalizado"}
							</Badge>
							<h2 className="font-bold">{booking?.service!.name}</h2>
							<div className="flex items-center gap-2">
								<Avatar className="h-6 w-6">
									<AvatarImage src={booking?.establishment.imageUrl} />
									<AvatarFallback>A</AvatarFallback>
								</Avatar>
								<h3 className="text-sm">{booking?.establishment.name}</h3>
							</div>
						</div>
						<div className="flex flex-col items-center justify-center flex-1 border-l border-solid border-secondary">
							<p className="text-sm capitalize">
								{format(booking.date, "MMMM", {
									locale: ptBR,
								})}
							</p>
							<p className="text-2xl">{format(booking.date, "dd")}</p>
							<p className="text-sm">{format(booking.date, "hh':'mm")}</p>
						</div>
					</CardContent>
				</Card>
			</SheetTrigger>

			<SheetContent className="px-0">
				<SheetHeader className="text-left px-5 pb-6 border-b border-solid border-secondary">
					<SheetTitle>Informações da Reserva</SheetTitle>
				</SheetHeader>

				<div className="px-5">
					<div className="relative h-[180px] w-full mt-6">
						<Image
							src="/EstablishmentCard.png"
							fill
							alt={booking?.establishment.name}
						/>
						<div className="w-full absolute bottom-4 left-0 px-5">
							<Card>
								<CardContent className="p-3 flex gap-2">
									<Avatar>
										<AvatarImage src={booking?.establishment.imageUrl} />
									</Avatar>

									<div>
										<h2 className="font-bold">{booking?.establishment.name}</h2>
										<h3 className="text-xs overflow-hidden text-ellipsis text-nowrap">
											{booking?.establishment.address}
										</h3>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>

					<Badge
						className="w-fit my-3"
						variant={isBookingConfirmed ? "default" : "secondary"}
					>
						{isBookingConfirmed ? "Confirmado" : "Finalizado"}
					</Badge>
					<div className="py-6 px-5 border-t border-solid border-secondary">
						<Card>
							<CardContent className="p-3 gap-3 flex flex-col">
								<div className="flex justify-between">
									<h2 className="font-bold">{booking.service!.name}</h2>
									<h3 className="font-bold text-sm">
										{" "}
										{Intl.NumberFormat("pt-BR", {
											style: "currency",
											currency: "BRL",
										}).format(Number(booking.service!.price))}
									</h3>
								</div>

								<div className="flex justify-between">
									<h3 className="text-gray-400 text-sm">Data</h3>
									<h4 className="text-sm capitalize">
										{format(booking.date, "dd 'de' MMMM", {
											locale: ptBR,
										})}
									</h4>
								</div>

								<div className="flex justify-between">
									<h3 className="text-gray-400 text-sm">Horário</h3>
									<h4 className="text-sm capitalize">
										{format(booking.date, "hh':'mm")}
									</h4>
								</div>

								<div className="flex justify-between">
									<h3 className="text-gray-400 text-sm">Estabelecimento</h3>
									<h4 className="text-sm capitalize">
										{booking.establishment.name}
									</h4>
								</div>
							</CardContent>
						</Card>
					</div>

					<SheetFooter className="flex-row w-full gap-3 mt-6">
						<SheetClose asChild>
							<Button className="w-full" variant="secondary">
								Voltar
							</Button>
						</SheetClose>
						<AlertDialog>
							<AlertDialogTrigger>
								<Button
									disabled={!isBookingConfirmed || isDeleteLoading}
									className="w-full"
									variant="destructive"
								>
									Cancelar Reserva
								</Button>
							</AlertDialogTrigger>

							<AlertDialogContent className="w-[90%]">
								<AlertDialogHeader>
									<AlertDialogTitle className="text-center">
										Cancelar Reserva
									</AlertDialogTitle>

									<AlertDialogDescription className="text-center">
										Tem certeza que deseja cancelar esse agendamento?
									</AlertDialogDescription>
								</AlertDialogHeader>

								<AlertDialogFooter className="flex-row gap-3">
									<AlertDialogCancel className="w-full mt-0">
										Voltar
									</AlertDialogCancel>
									<AlertDialogAction
										disabled={isDeleteLoading}
										onClick={handleCancelClick}
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
					</SheetFooter>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default BookingItem;
