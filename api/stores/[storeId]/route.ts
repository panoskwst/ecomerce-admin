import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// params can only be in the second argument of this function so even if we are not using the request we need to include it
export async function PATCH(
    req:Request,
    // the storeid it is obtained by the url path
    {params}: {params: {storeId: string}} 
) {
    try {
            // we take the userId from clerk
            const {userId} = auth();
            // we are taking the body of our patch request
            const body = await req.json();
            // we extract the name from the request
            const {name} = body;

            // we check if there is a user
            if(!userId){
                return new NextResponse("Unauthenticated",{status:401});
            }

            // we check if there is a name in the request in case the zod validation in our settingsForm failed
            if(!name){
                return new NextResponse("Name is required",{status:400});
            }
            // we check if there is a store id
            if(!params.storeId){
                return new NextResponse("Store id is required",{status:400});
            }

            // if all the above don't trigger then we create a store and update it with the new name
            const store = await prismadb.store.updateMany({
                where:{
                    id: params.storeId,
                    userId
                },
                data:{
                    name
                }
            });

            return NextResponse.json(store);

    } catch (error) {
        // this will show us that it is the individual store the patch method
        console.log('[STORE_PATCH]',error);
        return new NextResponse("Internal error",{status:500});
    }
}

export async function DELETE(
    req:Request,
    // the storeid comes from the folder streid itch is in the route
    {params}: {params: {storeId: string}} 
) {
    try {
            // we take the userId from clerk
            const {userId} = auth();
            // we check if there is a user
            if(!userId){
                return new NextResponse("Unauthenticated",{status:401});
            }

            // we check if there is a store id
            if(!params.storeId){
                return new NextResponse("Store id is required",{status:400});
            }

            // if all the above don't trigger then we create a store and delete it from the prisma db
            const store = await prismadb.store.deleteMany({
                where:{
                    id: params.storeId,
                    userId
                }
            });

            return NextResponse.json(store);

    } catch (error) {
        // this will show us that it is the individual store the patch method
        console.log('[STORE_DELETE]',error);
        return new NextResponse("Internal error",{status:500});
    }
}