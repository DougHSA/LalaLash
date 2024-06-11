import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Booking } from "@prisma/client";
import { authOptions } from "@/app/_lib/auth";
import { db } from "@/app/_lib/prisma";
import Header from "@/app/_components/header";
import BookingItemCustomer from "@/app/_components/booking-item-customer";

interface EstablishmentBookingPageProps{
    params: {
        id: string;
      };
}
const BookingsPage = async ({params}: EstablishmentBookingPageProps) => {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		return redirect("/");
	}

	const [confirmedBookings, finishedBookings] = await Promise.all([
		db.booking.findMany({
			where: {
				establishmentId: params.id,
				date: {
					gte: new Date(),
				},
			},
			include: {
				service: true,
				establishment: true,
                user:true
			},
			orderBy: {
				date: "asc",
			},
		}),
		db.booking.findMany({
			take: 5,
			where: {
				establishmentId: params.id,
				date: {
					lt: new Date(),
				},
			},
			include: {
				service: true,
				establishment: true,
                user:true
			},
			orderBy: {
				date: "asc",
			},
		}),
	]);

	return (
		<>
			<Header />

			<div className="px-5 py-6">
				<h1 className="text-xl font-bold mb-6">Agendamentos</h1>

				{confirmedBookings.length > 0 && (
					<h2 className="text-gray-400 uppercase font-bold text-sm mb-3">
						Confirmados
					</h2>
				)}

				<div className="flex flex-col gap-3">
					{confirmedBookings.map((booking) => (
						<BookingItemCustomer key={booking.id} booking={booking} />
					))}
				</div>

				{finishedBookings.length > 0 && (
					<h2 className="text-gray-400 uppercase font-bold text-sm my-6 mb-3">
						Finalizados
					</h2>
				)}

				<div className="flex flex-col gap-3">
					{finishedBookings.map((booking) => (
						<BookingItemCustomer key={booking.id} booking={booking} />
					))}
				</div>
			</div>
		</>
	);
};

export default BookingsPage;
