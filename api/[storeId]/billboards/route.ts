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

        const {label,imageUrl} = body;

        // checks if we have a userid if we don't it returns error 401 unothorized
        if(!userId){
            return new NextResponse("Unathandicated",{status:401});
        }

        // checks if there is a name
        if(!label){
            return new NextResponse("Label is required",{status:400});
        }

        
        if(!imageUrl){
            return new NextResponse("image URL is required",{status:400});
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
        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }

        });

        return NextResponse.json(billboard);
        
    } catch (error) {
        console.log('[BILLBOARDS_POST]',error);
        return new NextResponse("Interal error",{status:500});


        
        
    }
}

export async function GET (
    req: Request,
    {params}: {params:{storeId:string}}
){
    try {
        if (!params.storeId) {
            return new NextResponse("Store Id is required",{status:400});   
        }

        // if all the above are correcrt and they are not trigered we create our store
        const billboard = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId,
            },

        });

        return NextResponse.json(billboard);
        
    } catch (error) {
        console.log('[BILLBOARDS_POST]',error);
        return new NextResponse("Interal error",{status:500});


        
        
    }
}