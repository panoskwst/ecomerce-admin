"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BillboardColumn = {
  id: string
  label: string
  createdAt: string
}

// The "Label" column is defined with accessorKey: "label".
// This means that the data in the "label" property of the data objects will be displayed in this column.
export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    //  This means that the header for this column will display the text "Label."
    header: "Label",
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
