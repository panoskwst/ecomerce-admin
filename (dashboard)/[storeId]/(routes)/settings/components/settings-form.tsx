"use client";

import { Store } from "@prisma/client"
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";


interface SettingsFormProps{
    initialData:Store;
}

//  Define a Zod schema for form validation. we spacify that the form has a name field of type string with a minimum length of 1 character.
const formSchema = z.object({
    name: z.string().min(1),
});

//  z.infer is a zod library that extracts the TypeScript type that Zod would assign to a valid data structure based on the schema definition.
type SettingsFormValues =z.infer<typeof formSchema>;

// we are passing from the page the store as initialData
export const SettingsForm:React.FC<SettingsFormProps> = ({
    initialData
}) =>{
    const params = useParams();
    const router = useRouter();
    // this controlles the alert model
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const origin = useOrigin();

    // we are passing in the form our store values(initialData)
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })
    
    // we create the onSubmit function 
    const onSubmit =async (data: SettingsFormValues) =>{
        try {
            setLoading(true);
            // we are sending with the patch method in the specifice url
            await axios.patch(`/api/stores/${params.storeId}`,data);
            // we are refreshing the page so we can have the new data
            router.refresh();
            toast.success("Store updated");

        } catch (error) {
            toast.error("something went wrong.")
        }finally{
            setLoading(false);
        }
    };

    const onDelete = async () =>{
        try {
            setLoading(true);
            console.log(params.storeId);
            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh();
            router.push("/");
            toast.success("Store deleted");
            
        } catch (error) {
            console.log(params.storeId);
            toast.error("Make sure you removed all products and categories first.");
            
        }finally{
            setLoading(false);
            setOpen(false);
        }
    }

    return(
        <>
            <AlertModal 
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading
                    title="Settings"
                    description="Manage store preferences"
                />
                <Button
                disabled={loading}
                    variant="destructive"
                    size="icon"
                    // we are setting open to true to open our alert model
                    onClick={() => setOpen(true)}
                >
                    <Trash className="h-4 w-4" />

                </Button>
            </div>
            <Separator />
            {/* we spread the form that we have from the form hook above*/}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Store name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormLabel>
                                </FormItem>
                            )}
                        />

                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit" >
                        Save Changes
                    </Button>

                </form>

            </Form>
            <Separator />
            <ApiAlert 
            title="NEXT_PUBLIC_API_URL" 
            description={`${origin}/api/${params.storeId}`}
            variant="public"
            />
        </>
    )
}