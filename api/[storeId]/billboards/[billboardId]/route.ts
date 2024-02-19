import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
    req:Request,
    // the storeid comes from the folder streid itch is in the route
    {params}: {params: { billboardId:string}} 
) {
    try {
            // we check if there is a store id
            if(!params.billboardId){
                return new NextResponse("Billboard id is required",{status:400});
            }

            // if all the above don't trigger then we create a store and delete it from the prisma db
            const billboard = await prismadb.billboard.findUnique({
                where:{
                    id: params.billboardId,
                }
            });

            return NextResponse.json(billboard);

    } catch (error) {
        // this will show us that it is the individual store the patch method
        console.log('[BILLBOARD_GET]',error);
        return new NextResponse("Internal error",{status:500});
    }
}

// params can only be in the second argument of this function so even if we are not using the request we need to include it
export async function PATCH(
    req:Request,
    // the storeid it is obtained by the url path
    {params}: {params: {storeId:string, billboardId: string}} 
) {
    try {
            // we take the userId from clerk
            const {userId} = auth();
            // we are taking the body of our patch request
            const body = await req.json();
            // we extract the name from the request
            const {label,imageUrl} = body;

            // we check if there is a user
            if(!userId){
                return new NextResponse("Unauthenticated",{status:401});
            }

            // we check if there is a label in the request in case the zod validation in our settingsForm failed
            if(!label){
                return new NextResponse("Label is required",{status:400});
            }

            // we check if there is an image Url in the request in case the zod validation in our settingsForm failed
            if(!imageUrl){
                return new NextResponse("Image URL is required",{status:400});
            }

            // we check if there is a store id
            if(!params.billboardId){
                return new NextResponse("Billboard id is required",{status:400});
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
            const billboard = await prismadb.billboard.updateMany({
                where:{
                    id: params.billboardId,

                },
                data:{
                    label,
                    imageUrl
                }
            });

            return NextResponse.json(billboard);

    } catch (error) {
        // this will show us that it is the individual store the patch method
        console.log('[BILLBOARD_PATCH]',error);
        return new NextResponse("Internal error",{status:500});
    }
}

export async function DELETE(
    req:Request,
    // the storeid comes from the folder streid itch is in the route
    {params}: {params: {storeId: string, billboardId:string}} 
) {
    try {
            // we take the userId from clerk
            const {userId} = auth();
            // we check if there is a user
            if(!userId){
                return new NextResponse("Unauthenticated",{status:401});
            }

            // we check if there is a store id
            if(!params.billboardId){
                return new NextResponse("Billboard id is required",{status:400});
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
            const billboard = await prismadb.billboard.deleteMany({
                where:{
                    id: params.billboardId,
                }
            });

            return NextResponse.json(billboard);

    } catch (error) {
        // this will show us that it is the individual store the patch method
        console.log('[BILLBOARD_DELETE]',error);
        return new NextResponse("Internal error",{status:500});
    }
}
