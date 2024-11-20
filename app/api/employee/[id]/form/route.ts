import { connectDB } from "@/lib/db";
import { Employee } from "@/lib/schema";
import { NextResponse } from "next/server";

// -------------------------------------
// PATCH: Find and update an employee by ID
// -------------------------------------
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB(); // Connect to the database

    const { id } = params; // Get the employeeId from the request parameters
    const body = await req.json(); // Get the request body
    const { formId } = body; // Get the team from the request body

    if (!formId) {
      return NextResponse.json(
        { message: "Form ID not found" },
        {
          status: 404,
        }
      );
    }

    const assignedFormEmployee = await Employee.findOneAndUpdate({ employeeId: id }, { formId }, { new: true }); // Update the employee with formId

    return NextResponse.json(assignedFormEmployee, { status: 200 });
  } catch (error) {
    console.error("PATCH error:", error); // Log the error for debugging
    return NextResponse.json(
      { message: (error as Error).message },
      {
        status: 500,
      }
    );
  }
}
