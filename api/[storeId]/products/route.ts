import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST (
    req: Request,
    {params}: {params:{storeId:string}}
){
    try {
        const {userId} = auth();
        const body = await req.json();

        const {name,images,price,categoryId,sizeId,colorId,isFeatured,isArchived} = body;

        // checks if we have a userid if we don't it returns error 401 unothorized
        if(!userId){
            return new NextResponse("Unathandicated",{status:401});
        }

        // checks if there is a name
        if(!name){
            return new NextResponse("Name is required",{status:400});
        }

        
        if(!price){
            return new NextResponse("Price is required",{status:400});
        }

        if(!categoryId){
            return new NextResponse("Category id is required",{status:400});
        }

        if(!sizeId){
            return new NextResponse("Size id is required",{status:400});
        }

        if(!colorId){
            return new NextResponse("Color id is required",{status:400});
        }

        if(!images || !images.length){
            return new NextResponse("Images is required",{status:400});
        }

        if (!params.storeId) {
            console.log(params.storeId);
            return new NextResponse("Store Id is required",{status:400});   
        }
        
        // we are passing the store where the current user is the same one in the store that has in db
        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id: params.storeId,
                userId
            }
        });

        // checks if the store has the same user inside
        if(!storeByUserId){
            return new NextResponse("Unothorized",{status:403});
        }

        // if all the above are correcrt and they are not trigered we create our store
        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                sizeId,
                colorId,
                categoryId,
                images:{
                    createMany:{
                        data: [
                            ...images.map((image:{url:string})=>image)
                        ]
                    }
                },
                storeId: params.storeId
            }

        });

        return NextResponse.json(product);
        
    } catch (error) {
        console.log('[PRODUCTS_POST]',error);
        return new NextResponse("Interal error",{status:500});


        
        
    }
}

export async function GET (
    req: Request,
    {params}: {params:{storeId:string}}
){
    try {
        const {searchParams} = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const isFeatured = searchParams.get("isFeatured");

        if (!params.storeId) {
            return new NextResponse("Store Id is required",{status:400});   
        }

        // if all the above are correcrt and they are not trigered we create our store
        const product = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                sizeId,
                colorId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                category: true,
                size: true,
                color: true,
                images: true
            },
            orderBy:{
                createdAt:'desc'
            }

        });

        return NextResponse.json(product);
        
    } catch (error) {
        console.log('[PRODUCTS_GET]',error);
        return new NextResponse("Interal error",{status:500});


        
        
    }
}