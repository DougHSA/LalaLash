import { Card, CardContent } from "@/app/_components/ui/card";
import { Employee } from "@prisma/client";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EmployeeItemProps{
    onClick?: () => void;
    employee: Employee;
    className?: string;
}

const EmployeeItem = ({employee, onClick, className}:EmployeeItemProps) => {
    return (
        <button onClick={onClick}>
            <Card className={className}>
                <CardContent className="py-0 px-5 flex">
                    <div className="flex gap-2">
                        <div className="flex items-center">
                            <Avatar className="flex h-10 w-10 items-center justify-center">
                                <AvatarImage src={employee.image!} />
                                <AvatarFallback>{employee.name[0]}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex flex-col py-3 gap-2 pl-5 pr-2">
                            <h2 className="flex font-bold text-nowrap">{employee.name}</h2>
                            <h3 className="flex text-sm text-nowrap w-full">{employee.role}</h3>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </button>
    );
}
 
export default EmployeeItem;