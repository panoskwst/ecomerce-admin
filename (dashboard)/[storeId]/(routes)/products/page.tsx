import {format} from "date-fns";
import prismadb from "@/lib/prismadb";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const ProductsPage = async({
    params
}:{
    params:{storeId: string}
}) =>{
    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId
        },
        // we are using include in order to display the category size and image of the products
        include: {
            category: true,
            size: true,
            color: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedProducts: ProductColumn[] = products.map((item)=>({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchive: item.isArchived,
        // we are using the formatter that we create in the utilis file to display it as dollars
        // because the price in our db is decimal we need to converted in number so we use the .toNumber()
        price: formatter.format(item.price.toNumber()),
        category: item.category.name,
        size: item.size.name,
        color: item.color.value,
        createdAt: format(item.createdAt,"MMMM do, yyyy")
    }))

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts} />

            </div>
        </div>
    );
}

export default ProductsPage;