import { connectDB } from "@/lib/db";
import { generateUniqueFormId } from "@/lib/function";
import { Form } from "@/lib/schema";
import { NextResponse } from "next/server";

// ------------------------------
// GET /api/form
// ------------------------------
export async function GET() {
  try {
    await connectDB();

    const forms = await Form.find();

    if (!forms || forms.length === 0) {
      return NextResponse.json({ message: "No forms found" }, { status: 404 });
    }

    return NextResponse.json(forms, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// ------------------------------
// POST /api/form
// ------------------------------
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const formId = await generateUniqueFormId();

    const { questions } = body;

    if (!questions) {
      return NextResponse.json({ message: "Please provide all fields" }, { status: 400 });
    }

    const newForm = {
      formId,
      questions: questions || [],
    };

    const form = await Form.create(newForm);

    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
