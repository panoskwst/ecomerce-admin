import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST (
    req: Request,
){
    try {
        const {userId} = auth();
        const body = await req.json();

        const {name} = body;

        // checks if we have a userid if we don't it returns error 401 unothorized
        if(!userId){
            return new NextResponse("Unothorized",{status:401});
        }

        // checks if there is a name
        if(!name){
            return new NextResponse("Name is required",{status:400});
        }

        // if all the above are correcrt and they are not trigered we create our store
        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }

        });

        return NextResponse.json(store);
        
    } catch (error) {
        console.log('[STORES_POST]',error);
        return new NextResponse("Interal error",{status:500});
        
    }
}