import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
    req:Request,
    // the storeid comes from the folder streid itch is in the route
    {params}: {params: { colorId:string}} 
) {
    try {
            // we check if there is a store id
            if(!params.colorId){
                return new NextResponse("Color id is required",{status:400});
            }

            // if all the above don't trigger then we create a store and delete it from the prisma db
            const color = await prismadb.color.findUnique({
                where:{
                    id: params.colorId,
                }
            });

            return NextResponse.json(color);

    } catch (error) {
        // this will show us that it is the individual store the patch method
        console.log('[COLOR_GET]',error);
        return new NextResponse("Internal error",{status:500});
    }
}

// params can only be in the second argument of this function so even if we are not using the request we need to include it
export async function PATCH(
    req:Request,
    // the storeid it is obtained by the url path
    {params}: {params: {storeId:string, colorId: string}} 
) {
    try {
            // we take the userId from clerk
            const {userId} = auth();
            // we are taking the body of our patch request
            const body = await req.json();
            // we extract the name from the request
            const {name,value} = body;

            // we check if there is a user
            if(!userId){
                return new NextResponse("Unauthenticated",{status:401});
            }

            // we check if there is a label in the request in case the zod validation in our settingsForm failed
            if(!name){
                return new NextResponse("Name is required",{status:400});
            }

            // we check if there is an image Url in the request in case the zod validation in our settingsForm failed
            if(!value){
                return new NextResponse("Value is required",{status:400});
            }

            // we check if there is a store id
            if(!params.colorId){
                return new NextResponse("Color id is required",{status:400});
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


            // if all the above don't trigger then we create a store and update it with the new name
            const color = await prismadb.color.updateMany({
                where:{
                    id: params.colorId,

                },
                data:{
                    name,
                    value
                }
            });

            return NextResponse.json(color);

    } catch (error) {
        // this will show us that it is the individual store the patch method
        console.log('COLOR_PATCH]',error);
        return new NextResponse("Internal error",{status:500});
    }
}

export async function DELETE(
    req:Request,
    // the storeid comes from the folder streid itch is in the route
    {params}: {params: {storeId: string, colorId:string}} 
) {
    try {
            // we take the userId from clerk
            const {userId} = auth();
            // we check if there is a user
            if(!userId){
                return new NextResponse("Unauthenticated",{status:401});
            }

            // we check if there is a store id
            if(!params.colorId){
                return new NextResponse("Color id is required",{status:400});
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

            // if all the above don't trigger then we create a store and delete it from the prisma db
            const color = await prismadb.color.deleteMany({
                where:{
                    id: params.colorId,
                }
            });

            return NextResponse.json(color);

    } catch (error) {
        // this will show us that it is the individual store the patch method
        console.log('[COLOR_DELETE]',error);
        return new NextResponse("Internal error",{status:500});
    }
}
