"use client"

import { CalendarIcon, HomeIcon, LogInIcon, LogOutIcon, MenuIcon, SettingsIcon, UserIcon } from "lucide-react";
import { Button } from "./ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Avatar, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { hasManagerEmail } from "../_actions/has-manager-email";

const SideMenu = () => {
    const {data} = useSession();
    const handleLogoutClick = () => signOut(); 
    const handleLoginClick = () => signIn("google"); 
    const [isManager, setIsManager] = useState<Boolean>();

    useEffect(()=>{
        if(!data?.user)
            return;
        const refreshEstablishments = async () =>{
            setIsManager(await hasManagerEmail(data.user!.email!));
        };
        refreshEstablishments();

    },[data]);
    return (
        <>
            <SheetHeader className="p-5 text-left border-b border-solid border-secondary">
                <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            {data?.user ? (
                <div className="flex justify-between px-5 py-6 items-center">
                    <div className="flex items-center gap-3 ">
                        <Avatar>
                            <AvatarImage src={data.user?.image ?? ""} />
                        </Avatar>

                        <h2 className="font-bold">{data.user.name}</h2>
                    </div>

                    <Button variant="secondary" size="icon">
                        <LogOutIcon onClick={handleLogoutClick} />
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col px-5 py-6 gap-3">
                    <div className="flex items-center gap-2">
                        <UserIcon size={32} />
                        <h2 className="font-bold">Olá. Faça seu login!</h2>
                    </div>
                    <Button variant="secondary" className="w-full justify-start" onClick={handleLoginClick}>
                        <LogInIcon className="mr-2" size={18} />
                        Fazer Login
                    </Button>
                </div>
            )}

            <div className="flex flex-col gap-3 px-5">
                <Button variant="outline" className="justify-start" asChild>
                    <Link href="/">
                        <HomeIcon size={18} className="mr-2"/>
                        Início
                    </Link>
                </Button>
                {data?.user && (
                    <Button variant="outline" className="justify-start" asChild>
                        <Link href="/bookings">
                            <CalendarIcon size={18} className="mr-2"/>
                            Agendamentos
                        </Link>
                    </Button>
                )}
                {data?.user && isManager && (
                    <Button variant="outline" className="justify-start" asChild>
                        <Link href="/settings">
                            <SettingsIcon size={18} className="mr-2"/>
                            Configurar Horários
                        </Link>
                    </Button>
                )}
            </div>
        </>
     );
}
 
export default SideMenu;