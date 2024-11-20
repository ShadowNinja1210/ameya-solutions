"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchEmployees } from "@/lib/api";
import EmployeeTable from "./components/employee-table";
import { useEffect, useState } from "react";
import { IEmployee } from "@/lib/schema";
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Dialog, DialogTrigger } from "../ui/dialog";
import EmployeeForm from "./components/employee-form";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<IEmployee[]>([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["employee"], // Query key
    queryFn: fetchEmployees, // Query function
  });

  useEffect(() => {
    if (data && !isLoading) {
      const employees = data.map((employee: IEmployee) => {
        const supervisorData = data.find((emp: IEmployee) => emp.employeeId === employee.supervisor);
        console.log(employee.employeeId);

        console.log(supervisorData);
        return { ...employee, supervisor: supervisorData ? supervisorData.name || "Admin" : "Admin" };
      });
      setEmployees(employees);
    }
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="flex container flex-col justify-center text-center">
      <div className="flex justify-between items-center py-4">
        <h1 className="text-3xl font-bold text-left">Employees</h1>
        <Dialog>
          <DialogTrigger>
            <Button className="mt-4">Add Employee</Button>
          </DialogTrigger>
          <EmployeeForm />
        </Dialog>
      </div>
      <ScrollArea className=" w-full max-w-[100vw]">
        <EmployeeTable employees={data} />
        <ScrollBar />
      </ScrollArea>
    </div>
  );
}
