"use client";

import SideMenu from "@/app/_components/side-menu";
import { Button } from "@/app/_components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/app/_components/ui/sheet";
import { Establishment } from "@prisma/client";
import { ChevronLeftIcon, MenuIcon, MapPinIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface EstablishmentInfoProps{
    establishment: Establishment;
}

const EstablishmentInfo = ({establishment}: EstablishmentInfoProps) => {
    const router = useRouter();
    const handleBackClick = () =>{
        router.replace("/");
    }

    return (  
    <div>
        <div className="h-[250px] w-full relative">
            {/* <Button onClick={handleBackClick} size="icon" variant="outline" className="z-50 absolute top-4 left-4">
                <ChevronLeftIcon/>
            </Button> 
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="z-50 absolute top-4 right-4">
                        <MenuIcon/>
                    </Button>
                </SheetTrigger>

                <SheetContent className="p-0">
                    <SideMenu/>
                </SheetContent>
            </Sheet>*/}
            
            <Image src={establishment.imageUrl} fill alt={establishment.name} style={{
                objectFit:'cover',
                transform:'translate(-10% 0)'

            }} className="opacity-75"/>
        </div>
        
        <div className="px-5 pt-3 pb-6 border-b border-solid border-secondary">
            <h1 className="text-xl font-bold">{establishment.name}</h1>
            <div className="flex items-center gap-1 mt-2">
                <MapPinIcon className="text-primary" size={18}/>
                <p className="text-sm">{establishment.address}</p>
            </div>
            {/* <div className="flex items-center gap-1 mt-2">
                <StarIcon className="text-primary" size={18}/>
                <p className="text-sm">5,0 (899 avaliações)</p>
            </div> */}
        </div>
    </div> );
}
 
export default EstablishmentInfo;