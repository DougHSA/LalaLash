import Image from "next/image";
import { format, isFuture } from "date-fns";
import Header from "../_components/header";
import { ptBR } from "date-fns/locale";
import Search from "./_components/search";
import BookingItem from "../_components/booking-item";
import EstablishmentItem from "./_components/establishment-item";
import { db } from "../_lib/prisma";
import { Establishment, Booking } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import EstablishmentInfo from "../establishments/[id]/_components/establishment-info";
import ServiceItem from "../establishments/[id]/_components/service-item";

export default async function Home() {
	const session = await getServerSession(authOptions);

	const [establishments, recommendedEstablishments, confirmedBookings, lalalashEstablishment] = await Promise.all([
		db.establishment.findMany({}),
		db.establishment.findMany({ 
			orderBy: { 
				id:"asc" 
			}
		}),
		session?.user
			? db.booking.findMany({
					where: {
						userId: (session?.user as any).id,
						date: {
							gte: new Date(),
						},
					},
					include: {
						service: true,
						establishment: true,
					},
					orderBy: {
						date: "asc",
					},
				})
			: Promise.resolve([]),
		db.establishment.findUnique({
				where: {
				  id: 'e2d1e1fe-307f-4bd2-854e-9eaa4f72d7c1',
				},
				include: {
				  services: {
					include:{
					  employeeServices: {
						include:{
						  employee: true,
						}
					  }
					}
				  },
				  managers:{
					include:{
						manager: true
					}
				  }
				},
			  }),
	]);
	return (
		<div>
			<Header />
			<div className="px-5 pt-5">
				<h2 className="text-xl font-bold text-muted">
					{session?.user
						? <p>Olá, {session.user.name?.split(" ")[0]}!<br/> Vamos dar uma paginada no visual hoje?</p>
						: `Olá, vamos dar uma paginada no visual hoje?`}
				</h2>
				<p className="capitalize text-sm">
					{format(new Date(), "EEEE',' dd 'de' MMMM", {
						locale: ptBR,
					})}
				</p>
			</div>
			
			{lalalashEstablishment &&

				<div className="mt-6 mb-[4.5rem]">
					<EstablishmentInfo establishment={lalalashEstablishment} />

					<div className="px-5 flex flex-col gap-4 py-6">
						{lalalashEstablishment.services.map((service) => (
							<ServiceItem key={service.id} establishment={lalalashEstablishment} service={service} isAuthenticated={!!session?.user} employees={service.employeeServices.map(b=>b.employee)} />
						))}
					</div>
				</div>
			}
		</div>
	);
}
