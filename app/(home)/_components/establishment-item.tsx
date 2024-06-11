"use client";
import { Card, CardContent } from "../../_components/ui/card";
import Image from "next/image";
import { Establishment } from '@prisma/client';
import { Button } from "@/app/_components/ui/button";
import { Badge } from "@/app/_components/ui/badge";
import { StarIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface EstablishmentItemProps{
    establishment: Establishment;
}
const EstablishmentItem = ({establishment}: EstablishmentItemProps) => {
    const router = useRouter();
    const handleBookingClick = () =>{
        router.push(`/establishments/${establishment.id}`);
    }
    return ( 
        <Card className="min-w-full max-w-full rounded-2xl">
            <CardContent className="px-1 py-0 pt-1">
                <div className="px-1 w-full h-[159px] relative">
                    <div className="absolute top-2 left-2 z-50">
                        <Badge variant="secondary" className="flex opacity-90 gap-1 items-center ">
                            <StarIcon size={12} className="fill-primary text-primary"/>
                            <span className="text-xs">5,0</span>
                        </Badge>
                    </div>
                    <Image alt={establishment.name} src={establishment.imageUrl} fill className="rounded-2xl" style={{objectFit: 'cover',}}/>
                </div>
                <div className="px-2 pb-3">
                    <h2 className="font-bold overflow-hidden text-ellipsis text-nowrap mt-2">{establishment.name}</h2>
                    <p className="text-sm text-gray-400 overflow-hidden text-ellipsis text-nowrap">{establishment.address}</p>
                    <Button onClick={handleBookingClick} className="w-full mt-3" variant="secondary">Reservar</Button>
                </div>
            </CardContent>
        </Card>
     );
}
 
export default EstablishmentItem;