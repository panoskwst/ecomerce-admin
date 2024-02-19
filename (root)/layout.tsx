import prismadb from "@/lib/prismadb";
import {auth} from "@clerk/nextjs"
import { redirect } from "next/navigation";
export default async function SetupLayout({
    children
   
}:{
    children: React.ReactNode;

}) {
    const {userId} = auth();

    if(!userId){
        redirect("/sign-in");
    }

    const store = await prismadb.store.findFirst({
        where:{
            userId
        }
    });

    // checks if the store exist if it does it goes to the dashboard/storeId
    if(store){
        redirect(`/${store.id}`);
    }

    return(
        <>
        {children}
        </>
    )
    
}