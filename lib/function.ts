import { Employee } from "@/lib/schema"; // Adjust the path to the Employee model
import { v4 as uuidv4 } from "uuid";

// Function to generate a unique employee ID
export const generateUniqueEmployeeId = async (role: string, department: string): Promise<string> => {
  // Get a short role abbreviation
  const roleAbbreviation = role
    .split("-")
    .map((word) => word[0])
    .join("")
    .toUpperCase(); // e.g., "assistant-manager" -> "AM"

  // Get department abbreviation
  const departmentAbbreviation = department.slice(0, 3).toUpperCase(); // e.g., "Engineering" -> "ENG"

  // Generate a unique UUID suffix
  const uniqueSuffix = uuidv4().split("-")[0].toUpperCase(); // First segment of UUID, e.g., "A1B2C3D4"

  // Construct the ID
  const newEmployeeId = `${roleAbbreviation}-${departmentAbbreviation}-${uniqueSuffix}`;

  // Ensure the generated ID is unique
  const existingEmployee = await Employee.findOne({ employeeId: newEmployeeId });
  if (existingEmployee) {
    // Recursively call the function if ID is not unique
    return generateUniqueEmployeeId(role, department);
  }

  return newEmployeeId;
};

export const generateUniqueFormId = async (prefix: string = "FORM"): Promise<string> => {
  // Generate a short random alphanumeric string
  const randomString = Math.random().toString(36).substring(2, 6).toUpperCase(); // e.g., "A1B2"

  // Get a short timestamp for uniqueness
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4); // e.g., "X9T5"

  // Combine prefix, random string, and timestamp
  const formId = `${prefix}-${randomString}${timestamp}`;

  // Ensure the generated ID is unique
  const existingFormId = await Employee.findOne({ formId });
  if (existingFormId) {
    // Recursively call the function if ID is not unique
    return generateUniqueFormId();
  }

  return formId;
};
