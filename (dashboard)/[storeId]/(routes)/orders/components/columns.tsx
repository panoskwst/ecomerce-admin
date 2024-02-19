"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumn = {
  id: string
  phone: string
  address: string
  isPaid: boolean
  totalPrice: string
  products: string
  createdAt: string
}

// The "Label" column is defined with accessorKey: "label".
// This means that the data in the "label" property of the data objects will be displayed in this column.
export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    //  This means that the header for this column will display the text "Label."
    header: "Products",
  },
  {
    accessorKey: "phone",
    //  This means that the header for this column will display the text "Label."
    header: "Phone",
  },
  {
    accessorKey: "address",
    //  This means that the header for this column will display the text "Label."
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    //  This means that the header for this column will display the text "Label."
    header: "Total Price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
]
