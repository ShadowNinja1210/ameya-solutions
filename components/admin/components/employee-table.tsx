"use client";

import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowRight, ArrowUpDown, ChevronDown, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IEmployee, IForm } from "@/lib/schema";
import _ from "lodash";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialogContent,
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { assignForm, fetchForms } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const columns: ColumnDef<IEmployee>[] = [
  // ------Select Column------
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // ------Employee ID Column------
  {
    accessorKey: "employeeId",
    header: "Employee ID",
    cell: ({ row }) => <div className="capitalize">{row.getValue("employeeId")}</div>,
  },

  // ------Name Column------
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Employee Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },

  // ------Role Column------
  {
    accessorKey: "role",
    header: () => <div>Role</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium capitalize">{_.lowerCase(row.getValue("role"))}</div>;
    },
  },

  // ------Team Column------
  {
    accessorKey: "team",
    header: () => <div>Supervised Team</div>,
    cell: ({ row }) => (
      <HoverCard>
        <HoverCardTrigger>
          <Badge>{(row.getValue("team") as string[]).length} Members</Badge>
        </HoverCardTrigger>

        <HoverCardContent>
          {(row.getValue("team") as string[]).map((member) => (
            <div key={member} className="capitalize">
              {member}
            </div>
          ))}
        </HoverCardContent>
      </HoverCard>
    ),
  },

  // ------Supervisor Column------
  {
    accessorKey: "supervisor",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Supervisor
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("supervisor")}</div>,
  },

  // ------Department Column------
  {
    accessorKey: "department",
    header: () => <div>Department</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium capitalize">{_.lowerCase(row.getValue("department"))}</div>;
    },
  },

  // ------Form ID Column------
  {
    id: "formId",
    header: () => <div>Form ID</div>,
    enableHiding: false,
    cell: ({ row }) => {
      return <div>{row.getValue("formId") || "-"}</div>;
    },
  },
];

export default function EmployeeTable({ employees }: Readonly<{ employees: IEmployee[] }>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [formId, setFormId] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["forms"], // Query key
    queryFn: fetchForms, // Query function
  });

  const table = useReactTable({
    data: employees,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Assign form to selected employees
  const handleAssignForm = async () => {
    const selectedEmployeeIds = table.getFilteredSelectedRowModel().rows.map((row) => row.original.employeeId);

    if (!formId) {
      alert("Please enter a valid form ID.");
      return;
    }

    try {
      const assignPromises = selectedEmployeeIds.map((id) => assignForm(id, formId));
      await Promise.all(assignPromises);
      alert("Form assigned successfully!");
    } catch (error) {
      console.error("Error assigning form:", error);
      alert("Failed to assign form. Please try again.");
    }
  };

  return (
    <div className="w-full container">
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filter Employee ID..."
          value={(table.getColumn("employeeId")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("employeeId")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-4">
          {/* Delete Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={table.getFilteredSelectedRowModel().rows.length === 0}>
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete selected employees' Data?</AlertDialogTitle>
                <AlertDialogDescription>This action is irreversible. Please be careful!</AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                    <Button variant="outline">Cancel</Button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button>Delete</Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>

          {/* Assign Form Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={table.getFilteredSelectedRowModel().rows.length === 0}>
                Assign Form <ArrowRight />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <Label htmlFor="formSelect">Form ID</Label>
                <Select onValueChange={(value) => setFormId(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Form" />
                  </SelectTrigger>

                  <SelectContent>
                    {data?.map((form: IForm) => (
                      <SelectItem key={form.formId} value={form.formId} onClick={() => setFormId(form.formId)}>
                        {form.formId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAssignForm}>Assign</Button>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
