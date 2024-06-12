import { db } from "@/app/_lib/prisma";
import EstablishmentInfo from "./_components/establishment-info";
import ServiceItem from "./_components/service-item";
import { getServerSession } from "next-auth";
import { Service } from "@prisma/client";
import { authOptions } from "@/app/_lib/auth";
import { redirect } from "next/navigation";

interface EstablishmentDetailsPageProps {
  params: {
    id?: string;
  };
}

const EstablishmentDetailsPage = async ({ params }: EstablishmentDetailsPageProps) => {
  if (!params.id) {
    return redirect("/");
  }
  const [session, establishment] = await Promise.all([
    getServerSession(authOptions),
  db.establishment.findUnique({
    where: {
      id: params.id,
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
    },
  }),
]);

  if (!establishment) {
    return redirect("/");
  }

  return (
    <div>
      <EstablishmentInfo establishment={establishment} />

      <div className="px-5 flex flex-col gap-4 py-6">
        {establishment.services.map((service) => (
          <ServiceItem key={service.id} establishment={establishment} service={service} isAuthenticated={!!session?.user} employees={service.employeeServices.map(b=>b.employee)} />
        ))}
      </div>
    </div>
  );
};

export default EstablishmentDetailsPage;