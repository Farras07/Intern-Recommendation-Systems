"use client"

import * as React from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { VacancyTypes } from '@/types/JobTypes'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import _Fetch from '@/hooks/request.hooks'
import { BatchTableTypes } from '@/types/BatchTypes'
import { DialogValueTypes } from '@/types/DialogTypes'

type ColumnsVacancyPropsType = {
  dialogToggle: (props: DialogValueTypes) => void
  setFormState: (props: any) => void
}

export const columns = ({ dialogToggle, setFormState }: ColumnsVacancyPropsType ) : ColumnDef<VacancyTypes>[] => [
  {
    accessorKey: "no",
    header: "No"
  },
  {
    accessorKey: "id",
    header: "Vacancy ID"
  },
  {
    accessorKey: 'batchId',
    header: "Batch ID"
  },
  {
    accessorKey: 'role',
    header: 'Role',
    enableColumnFilter: true
  },
  {
    accessorKey: 'startDate',
    header: "Start Date"
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    enableSorting: true
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({row}) => {
      const status = row.getValue<'Pending' | 'On Process' | 'Done' | 'Failed'>('status')
      const color =
        status === 'Pending' ? 'bg-amber-500' :
        status === 'Hiring' ? 'bg-blue-500' :
        status === 'Done' ? 'bg-green-500' :
        'bg-red-500'

        return <div className={`w-4 h-4 rounded-full ${color}`} role='img' aria-label={status} title={status}/>
      

    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const handleDeleteVacancy = async() => {
        await _Fetch(`/intern/vacancy?id=${row.original.id}`, 'DELETE' )
      }
      const handleEditVacancy = async() => {
        dialogToggle({
          target: "Vacancy",
          action: "Edit"
        });
        setFormState((prev: any) => ({
          ...prev,
          data: {
            ...row.original,
          }

        }))
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleEditVacancy}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteVacancy}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  

]

