"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter,useParams } from "next/navigation";
import { ProductColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";;
import { ApiList } from "@/components/ui/api-list";

interface ProductClientProps{
    data: ProductColumn[]
}
export const ProductClient: React.FC<ProductClientProps> =({
    data
}) => {
    const router = useRouter();
    const params = useParams();
    return(
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Products: (${data.length})`}
                    description="Manage Products for your store" 
                    />
                    <Button onClick={()=> router.push(`/${params.storeId}/products/new`)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New
                    </Button>
            </div>
            <Separator />
            {/* We are passing the columns from the component columns that we creeated in the next file of the folder(accessorKey label and createdAt) the date we are passing them from the BillboardColumn  again in the same file */}
            <DataTable searchKey="name" columns={columns} data={data}/>
            <Heading title="Api" description="Api calls for products" />
            <Separator />
            <ApiList entityName="products" entityIdName="productId" />
        </>
    )
}