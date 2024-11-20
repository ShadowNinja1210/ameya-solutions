import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Employee, IEmployee } from "@/lib/schema";

// -------------------------------------
// GET: Retrieve an employee by ID
// -------------------------------------
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB(); // Connect to the database

    const { id } = params; // Get the employeeId from the request parameters

    const employees = await Employee.find(); // Query the employee

    const employee = employees.find((emp: IEmployee) => emp.employeeId.toLowerCase() === id.toLocaleLowerCase()); // Find the employee by ID

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(employee, { status: 200 });
  } catch (error) {
    console.error("GET error:", error); // Log the error for debugging
    return NextResponse.json(
      { message: (error as Error).message },
      {
        status: 500,
      }
    );
  }
}

// -------------------------------------
// PATCH: Find and update an employee by ID
// -------------------------------------
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB(); // Connect to the database

    const { id } = params; // Get the employeeId from the request parameters
    const body = await req.json(); // Get the request body
    const { newEmployeeId } = body; // Get the team from the request body

    const supervisor = await Employee.findOne({ employeeId: id }); // Find the employee by ID

    if (!supervisor) {
      return NextResponse.json(
        { message: "Supervisor not found" },
        {
          status: 404,
        }
      );
    }

    const team = [...(supervisor.team || []), newEmployeeId]; // Get the team from the employee

    const updatedSupervisor = await Employee.findOneAndUpdate({ employeeId: id }, { team }, { new: true }); // Update the employee

    return NextResponse.json(updatedSupervisor, { status: 200 });
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

// -------------------------------------
// DELETE: Delete an employee by ID
// -------------------------------------
export async function DELETE(req: Request, params: { id: string }) {
  try {
    await connectDB(); // Connect to the database

    const { id } = params; // Get the employeeId from the request parameters

    const employee = await Employee.deleteOne({ employeeId: id }); // Delete the employee

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      { message: `Employee with ID ${id} deleted successfully` },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("DELETE error:", error); // Log the error for debugging
    return NextResponse.json(
      { message: (error as Error).message },
      {
        status: 500,
      }
    );
  }
}
