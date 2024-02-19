import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({
    children,
    params
}:{
    children: React.ReactNode;
    params: {storeId: string}

}){
    // auth in clerk it passes the user sessions info and userId is one of those info
    const {userId} = auth();

    // check if we are loged in if we are not we redirect to /sign-in(using the next/navigation redirect )
    if(!userId){
        redirect('/sign-in');
    }

    // we are using the prisma .store.findfirst to find the first store wich the id is equal to params.storeId and userId = userId (we can write userId in this case)
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    });

    // checks if the store exist if it does not returns back to the root
    if(!store){
        redirect("/")
    }

    return(
        <>
        <Navbar />
        {children}
        </>
    )
}