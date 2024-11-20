// lib/api.ts
import axios from "axios";
import { IEmployee } from "./schema";

// Fetch employees
export const fetchEmployees = async () => {
  const { data } = await axios.get(`/api/employee`);
  return data;
};

// Fetch employee by ID
export const fetchEmployee = async (employeeId: string) => {
  const { data } = await axios.get(`/api/employee/${employeeId}`);
  return data;
};

// Create employee
export const createEmployee = async (employee: IEmployee) => {
  const { data } = await axios.post(`/api/employee`, employee);
  return data;
};

// Delete employee by ID
export const deleteOneEmployee = async (employeeId: string) => {
  const { data } = await axios.delete(`/api/employee/${employeeId}`);
  return data;
};

// Delete multiple employees
export const deleteManyEmployees = async (employeeIds: string[]) => {
  const { data } = await axios.delete(`/api/employee`, { data: { employeeIds } });
  return data;
};

// Fetch all supervisors
export const fetchSupervisors = async () => {
  const { data } = await axios.get(`/api/employee`);
  const supervisors = data.filter((employee: IEmployee) => employee.role != "junior-dev");
  return supervisors;
};

// Update supervisor of an employee and add employee to team
export const supervisorUpdate = async (supervisorId: string, newEmployeeId: string) => {
  const { data } = await axios.patch(`/api/employee/${supervisorId}`, newEmployeeId);
  return data;
};

// Assign form to employee
export const assignForm = async (employeeId: string, formId: string) => {
  const { data } = await axios.patch(`/api/employee/${employeeId}/form`, formId);
  return data;
};

// Fetch all forms
export const fetchForms = async () => {
  const { data } = await axios.get(`/api/form`);
  return data;
};
