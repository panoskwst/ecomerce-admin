"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColorColumn = {
  id: string
  name: string
  value: string
  createdAt: string
}

// The "Label" column is defined with accessorKey: "label".
// This means that the data in the "label" property of the data objects will be displayed in this column.
export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    //  This means that the header for this column will display the text "Label."
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({row}) =>(
      <div className="flex items-center gap-x-2">
        {row.original.value}
        <div 
          className="h-6 w-6 rounded-full border"
          style={{backgroundColor:row.original.value}}
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
