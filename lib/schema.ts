import mongoose, { Schema, Document, Model } from "mongoose";

// Enum for roles
export enum Role {
  MANAGER = "manager",
  ASSISTANT_MANAGER = "assistant-manager",
  SENIOR_DEV = "senior-dev",
  JUNIOR_DEV = "junior-dev",
}

// Employee Interface
export interface IEmployee extends Document {
  _id: mongoose.Types.ObjectId;
  employeeId: string;
  name: string;
  role: Role;
  supervisor: string; // Employee ID of the supervisor
  team: string[] | null; // Array of Employee IDs
  department: string;
  formId: string | null; // Assigned Form ID
}

// Employee Schema
const EmployeeSchema: Schema = new Schema<IEmployee>({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: Role, required: true },
  supervisor: { type: String, required: true }, // Employee ID of the supervisor
  team: [{ type: String }], // Array of Employee IDs
  department: { type: String, required: true },
  formId: { type: String || null, default: null },
});

// Check if the model exists to avoid OverwriteModelError during development reloads in Next.js
let Employee: Model<IEmployee>;
if (mongoose.models.Employee) {
  Employee = mongoose.models.Employee;
} else {
  Employee = mongoose.model<IEmployee>("Employee", EmployeeSchema.index({ employeeId: 1 }, { unique: true }));
}

// Enum for response roles
export enum ResponseRole {
  MANAGER = "manager",
  ASSISTANT_MANAGER = "assistant-manager",
  SENIOR_DEV = "senior-dev",
  JUNIOR_DEV = "junior-dev",
}

// Response Interface
export interface IResponse extends Document {
  _id: mongoose.Types.ObjectId;
  employeeId: string; // ID of the person being appraised
  submittedBy: string; // ID of the person submitting the appraisal
  role: ResponseRole; // Role of the submitter
  answers: Record<string, string>; // Key-value pairs for questionId and answers
  formId: string; // ID of the form used
  submittedAt: Date; // Submission date
}

// Responses Schema
const ResponseSchema: Schema = new Schema<IResponse>({
  employeeId: { type: String, required: true },
  submittedBy: { type: String, required: true },
  role: { type: String, enum: ResponseRole, required: true },
  answers: { type: Map, of: String, required: true }, // Hashmap for answers
  formId: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

// Check if the model exists to avoid OverwriteModelError during development reloads in Next.js
let Response: Model<IResponse>;
if (mongoose.models.Response) {
  Response = mongoose.models.Response;
} else {
  Response = mongoose.model<IResponse>(
    "Response",
    ResponseSchema.index({ employeeId: 1, formId: 1 }, { unique: true })
  );
}

// Enum for question types
export enum QuestionType {
  TEXT = "text",
  RATING = "rating",
}

// Form Interface
export interface IForm extends Document {
  _id: mongoose.Types.ObjectId;
  formId: string;
  questions: {
    questionId: string;
    question: string;
    type: QuestionType; // Type of question (e.g., text or rating)
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Form Schema
const FormSchema: Schema = new Schema<IForm>(
  {
    formId: { type: String, required: true },
    questions: [
      {
        questionId: { type: String, required: true },
        question: { type: String, required: true },
        type: { type: String, enum: QuestionType, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Check if the model exists to avoid OverwriteModelError during development reloads in Next.js
let Form: Model<IForm>;
if (mongoose.models.Form) {
  Form = mongoose.models.Form;
} else {
  Form = mongoose.model<IForm>("Form", FormSchema.index({ formId: 1 }, { unique: true }));
}

export { Employee, Form, Response };
