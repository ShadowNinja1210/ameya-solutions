import { connectDB } from "@/lib/db";
import { generateUniqueEmployeeId } from "@/lib/function";
import { Employee } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const employees = await Employee.find();

    if (!employees || employees.length === 0) {
      return NextResponse.json({ message: "No employees found" }, { status: 404 });
    }

    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const employeeId = await generateUniqueEmployeeId(body.department, body.role);

    const { name, department, role, supervisor, team } = body;

    if (!name || !department || !role || !supervisor) {
      return NextResponse.json({ message: "Please provide all fields" }, { status: 400 });
    }

    const newEmployee = {
      employeeId,
      name,
      role,
      supervisor,
      team: team || [],
      department,
      formId: null,
    };

    const employee = await Employee.create(newEmployee);

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { employeeIds } = body;

    if (!employeeIds || !Array.isArray(employeeIds)) {
      return NextResponse.json({ error: "Invalid input. Provide an array of employee IDs." }, { status: 400 });
    }

    const result = await Employee.deleteMany({
      employeeId: { $in: employeeIds },
    });

    return NextResponse.json(
      {
        message: `${result.deletedCount} employees deleted successfully.`,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
