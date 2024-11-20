import EmployeesPage from "@/components/admin/employees-page";
import FormsPage from "@/components/admin/forms-page";
import ResponsesPage from "@/components/admin/responses-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminPage() {
  return (
    <div className=" container py-8 flex min-h-screen justify-center text-center ">
      <title>Admin | ABC Company</title>

      <Tabs defaultValue="employees" className="">
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="forms">Appraisal Forms</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
        </TabsList>
        <TabsContent value="employees">
          <EmployeesPage />
        </TabsContent>
        <TabsContent value="responses">
          <ResponsesPage />
        </TabsContent>
        <TabsContent value="forms">
          <FormsPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
