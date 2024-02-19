"use client";

import { Billboard, Category } from "@prisma/client"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface CategoryFormProps{
    initialData: Category | null ;
    billboards: Billboard[];
}

//  Define a Zod schema for form validation. we spacify that the form has a name field of type string with a minimum length of 1 character.
const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
});

//  z.infer is a zod library that extracts the TypeScript type that Zod would assign to a valid data structure based on the schema definition.
type CategoryFormValues =z.infer<typeof formSchema>;

// we are passing from the store selection page the initialData
export const CategoryForm:React.FC<CategoryFormProps> = ({
    initialData,
    billboards,
}) =>{
    const params = useParams();
    const router = useRouter();
    // this controlles the alert model
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit category" : "Create category";
    const description = initialData ? "Edit a category" : "Add a new category";
    const toastMessage = initialData ? "Category updated." : "Category created.";
    const action = initialData ? "Save changes" : "Create";

    // we are passing in the form our store values(initialData)
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ||{
            name: '',
            billboardId: ''
        }
    })
    
    // we create the onSubmit function 
    const onSubmit =async (data: CategoryFormValues) =>{
        try {
            setLoading(true);
            // checks if we have initialData
            if(initialData){
                // we are sending with the patch method(becouse we have initialData so we edditing we don't create ) in the specifice url
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`,data);
            }else{
                // we are using post because we are saying to the server that we want to store new values
                await axios.post(`/api/${params.storeId}/categories`,data);
            }
            // we are refreshing the page so we can have the new data
            router.refresh();
            router.push(`/${params.storeId}/categories`);
            toast.success(toastMessage);

        } catch (error) {
            toast.error("something went wrong.")
            console.log("we have this storeid:",params.storeId);
        }finally{
            setLoading(false);
        }
    };

    const onDelete = async () =>{
        try {
            setLoading(true);
            console.log(params.storeId);
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            router.refresh();
            router.push(`/${params.storeId}/categories`);
            toast.success("Category deleted");
            
        } catch (error) {
            console.log(params.storeId);
            toast.error("Make sure you removed all products using this category first.");
            
        }finally{
            setLoading(false);
            setOpen(false);
        }
    }

    return(
        <>
        {console.log(params.storeId)}
            <AlertModal 
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description}
                />
                {/* checks if there is initialData and only if there is it shows the button */}
                {initialData &&(
                    <Button
                    disabled={loading}
                        variant="destructive"
                        size="icon"
                        // we are setting open to true to open our alert model
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />

                    </Button>
                )}
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
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Category name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="billboardId"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Billboard</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}  >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a billboard" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards.map((billboard)=>(
                                                <SelectItem key={billboard.id} value={billboard.id}>
                                                    {billboard.label}
                                                </SelectItem>
                                            ))}

                                        </SelectContent>

                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit" >
                        {action}
                    </Button>

                </form>

            </Form>
            <Separator />
        </>
    )
}