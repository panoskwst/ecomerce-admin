"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: string
  name: string
  price: string
  size:string
  category: string
  color: string
  isFeatured: boolean
  isArchive: boolean
  createdAt: string
}

// The "Label" column is defined with accessorKey: "label".
// This means that the data in the "label" property of the data objects will be displayed in this column.
export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    //  This means that the header for this column will display the text "Label."
    header: "Name",
  },
  {
    accessorKey: "isArchive",
    //  This means that the header for this column will display the text "Label."
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    //  This means that the header for this column will display the text "Label."
    header: "Featured",
  },
  {
    accessorKey: "price",
    //  This means that the header for this column will display the text "Label."
    header: "Price",
  },
  {
    accessorKey: "category",
    //  This means that the header for this column will display the text "Label."
    header: "Category",
  },
  {
    accessorKey: "size",
    //  This means that the header for this column will display the text "Label."
    header: "Size",
  },
  {
    accessorKey: "color",
    //  This means that the header for this column will display the text "Label."
    header: "Color",
    cell: ({row})=>(
      <div className="flex items-center gap-x-2">
        {row.original.color}
        <div 
          className="h-6 w-6 rounded-full border"
          style={{backgroundColor: row.original.color}}  
        />
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    // row: This is an object that represents the current row being rendered in the table.
    // It contains various properties and methods related to that row.
    id: "actions",
    // it renders the CellAction component and passes it some data from the current row using the row.original property.
    cell: ({row})=><CellAction data={row.original} />
  },
]
