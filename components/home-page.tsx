"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { Label } from "./ui/label";
import { useEmployees } from "@/hooks/useEmployee";
import Link from "next/link";

export default function HomePage() {
  const [employeeId, setEmployeeId] = useState("");

  const { employee, error, fetchEmployee, onClose } = useEmployees(employeeId);

  // const handleConfirm = async () => {
  //   console.log("Confirmed");
  // };

  return (
    <main className="flex min-h-screen justify-center items-center">
      <Card className="min-w-96 text-center">
        <CardHeader>
          <CardTitle className="text-xl">Appraisal Form</CardTitle>
          <CardDescription>Appraisal form for ABC Company.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="gap-2 flex flex-col items-center">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              placeholder="Employee ID"
              value={employeeId}
              onChange={(e) => {
                setEmployeeId(e.target.value.trim());
              }}
            />
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <Button onClick={fetchEmployee} type="submit" className="w-32">
            Submit
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={employee !== null} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Is this you?</AlertDialogTitle>
            <AlertDialogDescription>Please confirm your details.</AlertDialogDescription>
          </AlertDialogHeader>

          <div className=" grid grid-cols-2">
            <p className="font-semibold">Employee ID:</p>
            <p>{employee?.employeeId}</p>
            <p className="font-semibold">Employee Name:</p>
            <p>{employee?.name}</p>
            <p className="font-semibold">Supervisor Name:</p>
            <p>{employee?.supervisor}</p>
            <p className="font-semibold">Department:</p>
            <p>{employee?.department}</p>
            <p className="font-semibold">Role:</p>
            <p>{employee?.role}</p>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <Link href="/form">
              <AlertDialogAction>Yes</AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
