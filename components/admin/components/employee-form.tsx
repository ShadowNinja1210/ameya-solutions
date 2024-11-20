"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { IEmployee } from "@/lib/schema";
import { fetchEmployees, fetchSupervisors } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

import { ChevronDown } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const employeeSchema = z.object({
  name: z.string().min(2, { message: "Name is too short" }),
  role: z.string().min(2, { message: "Role is required" }),
  supervisor: z.string().optional(),
  team: z.array(z.string()),
  department: z.string().min(2, { message: "Department is required" }),
});

export default function EmployeeForm() {
  // ----- States ----- //
  const [newEmployeeId, setNewEmployeeId] = useState<string>("");

  // ----- Queries ----- //
  // Fetch supervisors
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["supervisors"], // Query key
    queryFn: fetchSupervisors, // Query function
    enabled: true,
  });

  // Fetch employees
  const {
    data: employees,
    isLoading: isEmployeeLoading,
    isError: isEmployeeError,
    error: employeeError,
  } = useQuery({
    queryKey: ["employees"], // Query key
    queryFn: fetchEmployees, // Query function
    enabled: true,
  });

  // ----- Form ----- //
  // useForm hook
  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      role: "",
      supervisor: "",
      team: [],
      department: "",
    },
  });

  // onSubmit function
  const onSubmit = async (values: {
    name: string;
    role: string;
    supervisor?: string;
    team: string[];
    department: string;
  }) => {
    console.log(values);

    const response = await fetch("/api/employee", {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (response.ok) {
      const data = await response.json();
      setNewEmployeeId(data.employeeId);
    }
  };

  // Destructure form values for the team field
  const team = form.watch("team");

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Employee Form</DialogTitle>
        <DialogDescription>Fill in the details below to add a new employee.</DialogDescription>
      </DialogHeader>

      {newEmployeeId ? (
        <div className="p-8 text-center font-semibold">
          New employee created with
          <br /> Employee ID: {newEmployeeId}.
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* ------------------------------------------ */}
            <div className="grid grid-cols-2 gap-4">
              {/* Employee Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label>Employee Name</Label>
                    <Input {...field} placeholder="Employee name" />
                    <FormMessage>{form.formState.errors.name?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Role Assigned to Employee */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <Label>Role Assigned</Label>
                    <Select value={form.getValues("role")} onValueChange={(value) => form.setValue("role", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="assistant-manager">Assistant Manager</SelectItem>
                        <SelectItem value="senior-dev">Senior Developer</SelectItem>
                        <SelectItem value="junior-dev">Junior Developer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage>{form.formState.errors.role?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            {/* ------------------------------------------ */}
            <div className="grid grid-cols-2 gap-4">
              {/* Supervisor of the employee */}
              <FormField
                control={form.control}
                name="supervisor"
                render={({ field }) => (
                  <FormItem>
                    <Label>Supervisor</Label>
                    <Select
                      value={form.getValues("supervisor")}
                      onValueChange={(value) => form.setValue("supervisor", value)}
                    >
                      <SelectTrigger className={`${isError && "border-red-100"}`}>
                        {isLoading ? "Loading" : isError ? error.message : <SelectValue placeholder="Supervisors" />}
                      </SelectTrigger>
                      <SelectContent>
                        {data.map((supervisor: IEmployee) => (
                          <SelectItem
                            value={supervisor.employeeId}
                          >{`${supervisor.name} (${supervisor.employeeId})`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage>{form.formState.errors.supervisor?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Department of the employee */}
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <Label>Department</Label>
                    <Select
                      value={form.getValues("department")}
                      onValueChange={(value) => form.setValue("department", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage>{form.formState.errors.department?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            {/* ------------------------------------------ */}
            <div className="grid grid-cols-2 gap-4 items-end">
              {/* Team members */}
              <FormField
                control={form.control}
                name="team"
                render={({ field }) => (
                  <FormItem>
                    <Label>Team members</Label>
                    <DropdownMenu {...field}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant={isEmployeeError ? "destructive" : "outline"}
                          className="w-full justify-between font-normal flex items-end"
                        >
                          {isEmployeeLoading
                            ? "Employees loading..."
                            : isEmployeeError
                            ? employeeError.message
                            : team.length === 0
                            ? "Team members"
                            : `Selected ${team.length}`}
                          <ChevronDown className="w-4 h-4 text-neutral-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {employees.map((employee: IEmployee) => (
                          <DropdownMenuCheckboxItem
                            checked={team.includes(employee.employeeId)}
                            onCheckedChange={(checked) =>
                              form.setValue(
                                "team",
                                checked
                                  ? [...team, employee.employeeId]
                                  : team.filter((id) => id !== employee.employeeId)
                              )
                            }
                          >
                            {`${employee.name} (${employee.employeeId})`}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormItem>
                )}
              />

              {/* Form description to show the team members selected */}
              <FormDescription>
                {`Selected team members(${form.getValues("team").length}) are: `}
                {form
                  .getValues("team")
                  .map(
                    (member, index) =>
                      `${member}${
                        index === form.getValues("team").length - 3
                          ? ", "
                          : index === form.getValues("team").length - 2
                          ? " and "
                          : index === form.getValues("team").length - 1 && "."
                      }`
                  )}
              </FormDescription>
            </div>

            {/* ------------------------------------------ */}
            {/* Buttons at the last form */}
            <div className="grid grid-cols-2 gap-4">
              {/* Reset Button */}
              <Button onClick={() => form.reset()} type="button" variant="outline">
                Reset
              </Button>

              {/* Submit Button */}
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      )}
    </DialogContent>
  );
}
