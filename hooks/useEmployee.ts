import { IEmployee } from "@/lib/schema";
import { useEffect, useState } from "react";

export function useEmployees(employeeId: string) {
  const [employee, setEmployee] = useState<IEmployee | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (employeeId !== "") {
      setError("");
    }
  }, [employeeId]);

  const onClose = () => {
    setEmployee(null);
  };

  const fetchEmployee = async () => {
    if (employeeId) {
      const response = await fetch(`/api/employee/${employeeId.toLowerCase()}`);

      const employee = await response.json();
      const supervisorId = employee.supervisor;

      const supervisorResponse = await fetch(`/api/employee/${supervisorId.toLowerCase()}`);

      const supervisor = await supervisorResponse.json();
      employee.supervisor = supervisor.name;

      if (!response.ok && response.status !== 404) {
        return alert(employee.message || supervisor.message || "An error occurred");
      } else if (response.status === 404) {
        setError("Employee not found");
      } else if (supervisorResponse.status === 404) {
        employee.supervisor = "Admin";
        setEmployee(employee);
      } else {
        setEmployee(employee);
      }
    } else {
      setError("Please enter your employee ID");
    }
  };

  return {
    employee,
    error,
    setError,
    fetchEmployee,
    onClose,
  };
}
