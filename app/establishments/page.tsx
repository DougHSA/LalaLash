import { Establishment } from "@prisma/client"
import Header from "../_components/header"
import { db } from "../_lib/prisma"
import EstablishmentItem from "../(home)/_components/establishment-item"
import { redirect } from "next/navigation"
import Search from "../(home)/_components/search"

interface EstablishmentsPageProps {
    searchParams:{
        search?: string
    }
}

const EstablishmentsPage = async ({searchParams} : EstablishmentsPageProps) => {
    if(!searchParams.search){
        return redirect("/");
    }
    const establishments = await db.establishment.findMany({
        where:{
            name: {
                contains: searchParams.search, 
                mode: "insensitive"
            },
        }
    })
    return(
        <>
            <Header />
            <div className="px-5 py-6 flex flex-col gap-6">
                <Search defaultValues={{
                    search: searchParams.search
                }}/>
                <h1 className="text-gray-400 font-bold text-xs uppercase">Resustados para &quot;{searchParams.search}&quot;</h1>
                <div className="grid gird-cols-2 gap-4">
                    {establishments.map((establishment:Establishment) => (
                        <div key={establishment.id} className="w-full">
                            <EstablishmentItem establishment={establishment}/>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default EstablishmentsPage