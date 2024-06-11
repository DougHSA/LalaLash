"use client";

import { signIn, useSession } from "next-auth/react";
import Header from "../_components/header";
import { getEstablishmentManager } from "./_actions/get-establishment-manager";
import EstablishmentItem from "../(home)/_components/establishment-item";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Manager, Prisma } from "@prisma/client";
import EstablishmentInfo from "../establishments/[id]/_components/establishment-info";

const SettingsPage = () => {
    const session = useSession();
    const router = useRouter();
    const [establishments, setEstablishments] = useState<Prisma.ManagerGetPayload<{
		include: {
			establishments:{
                include:{
                    establishment:true
                }
            }
		};
	}>>();

    useEffect(()=>{
        if(!session.data?.user)
            return;
        const refreshEstablishments = async () =>{
            const managerEstablishments = await getEstablishmentManager(session.data.user!.email!);
            if(!managerEstablishments)
                return redirect("/");
			setEstablishments(managerEstablishments);
        };
        refreshEstablishments();

    },[session]);
    if(!session?.data?.user)
        return redirect("/");

    const handleEstablishmentClick = (id: string) =>{
        router.push(`/settings/${id}`);
    }
    return ( 
        <>
            <Header/>
            <div className="p-6">

                <h1 className="mb-6">Escolha um estabelecimento para ajustar o horário:</h1>
                <div className="flex max-[570px]:justify-center gap-6 flex-wrap flex-shrink-0">
                    {establishments?.establishments.map((establishment) => (
                        <button key={establishment.establishmentId} className="w-[240px]" onClick={() => handleEstablishmentClick(establishment.establishmentId!)}>
                            <EstablishmentInfo
                                establishment={establishment.establishment}
                                key={establishment.establishmentId} 
                                />
                        </button>
                    ))}
                </div>
            </div>
        </>
     );
}
 
export default SettingsPage;