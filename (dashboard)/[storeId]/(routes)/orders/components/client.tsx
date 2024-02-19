"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";;


interface OrderClientProps{
    data: OrderColumn[]
}
export const OrderClient: React.FC<OrderClientProps> =({
    data
}) => {
    return(
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Orders: (${data.length})`}
                    description="Manage the Orders of your store" 
                    />
            </div>
            <Separator />
            <DataTable searchKey="products" columns={columns} data={data}/>
        </>
    )
}