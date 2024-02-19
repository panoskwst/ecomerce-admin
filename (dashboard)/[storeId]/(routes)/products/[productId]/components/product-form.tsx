"use client";

import { Category, Color, Image, Product, Size } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState,useEffect } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

//  Define a Zod schema for form validation. we spacify that the form has a name field of type string with a minimum length of 1 character.
const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({url: z.string()}).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional()
});

// because we need the images we are using the &{} to create an object and pass him the images with the value image[] array from the prisma client
interface ProductFormProps{
    initialData: Product &{
        images: Image []
    } | null ;
    categories: Category[];
    sizes: Size[];
    colors: Color[];
}

//  z.infer is a zod library that extracts the TypeScript type that Zod would assign to a valid data structure based on the schema definition.
type ProductFormValues =z.infer<typeof formSchema>;

// we are passing from the store selection page the initialData
export const ProductForm:React.FC<ProductFormProps> = ({
    initialData,
    categories,
    sizes,
    colors,
}) =>{
    const params = useParams();
    const router = useRouter();
    // this controlles the alert model
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit product" : "Create product";
    const description = initialData ? "Edit a product" : "Add a new product";
    const toastMessage = initialData ? "Product updated." : "Product created.";
    const action = initialData ? "Save changes" : "Create";

    // we are passing in the form our store values(initialData)
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ?{
            ...initialData,
            // we format the price becouse in prisma it is decimal but we here need it to be float
            price: parseFloat(String(initialData?.price)),
        } : {
            name: '',
            images:[],
            price: 0,
            categoryId: '',
            sizeId: '',
            colorId: '',
            isFeatured: false,
            isArchived: false,
            }
    })
    
    // we create the onSubmit function 
    const onSubmit =async (data: ProductFormValues) =>{
        try {
            setLoading(true);
            // checks if we have initialData
            if(initialData){
                // we are sending with the patch method(becouse we have initialData so we edditing we don't create ) in the specifice url
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`,data);
            }else{
                // we are using post because we are saying to the server that we want to store new values
                await axios.post(`/api/${params.storeId}/products`,data);
            }
            // we are refreshing the page so we can have the new data
            router.refresh();
            router.push(`/${params.storeId}/products`);
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success("Product deleted");
            
        } catch (error) {
            console.log(params.storeId);
            toast.error("Something went wrong with this product delete action.");
            
        }finally{
            setLoading(false);
            setOpen(false);
        }
    }
    useEffect(() => {
        {console.log("test")}
        if(categories){
            console.log("categories are empty")
        }
        if(!categories.length){
            console.log(categories.length)
        }
        {categories.forEach((category) => {
            console.log("categories:",category.name);
        })}
    
    }, [])
    
  

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
                    <FormField 
                        control={form.control}
                        name="images"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <ImageUpload 
                                        value={field.value.map((image)=>image.url)}
                                        disabled={loading}
                                        onChange={(url) => field.onChange([...field.value,{url}])}
                                        onRemove={(url) => field.onChange([...field.value.filter((current)=>current.url !== url)])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Product name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="price"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="categoryId"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}  >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category)=>(
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}

                                        </SelectContent>

                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="sizeId"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Size</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}  >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a size" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sizes.map((size)=>(
                                                <SelectItem key={size.id} value={size.id}>
                                                    {size.name}
                                                </SelectItem>
                                            ))}

                                        </SelectContent>

                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="colorId"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}  >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a color" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {colors.map((color)=>(
                                                <SelectItem key={color.id} value={color.id}>
                                                    {color.name}
                                                </SelectItem>
                                            ))}

                                        </SelectContent>

                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="isFeatured"
                            render={({field})=>(
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Featured
                                        </FormLabel>
                                        <FormDescription>
                                            This Product will appear on the home page
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="isArchived"
                            render={({field})=>(
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Archive
                                        </FormLabel>
                                        <FormDescription>
                                            This Product will not appear anywhere on the store
                                        </FormDescription>

                                    </div>
                                    
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
