"use client";

import { fetchForms } from "@/lib/api";
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import FormsList from "./components/forms-table";
import { Dialog, DialogTrigger } from "../ui/dialog";
import AddForms from "./components/add-forms";

export default function FormsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["form"], // Query key
    queryFn: fetchForms, // Query function
    enabled: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="flex container flex-col justify-center text-center">
      <div className="flex gap-4 justify-between items-center py-4">
        <h1 className="text-3xl font-bold text-left ">Appraisal Forms</h1>

        <Dialog>
          <DialogTrigger>
            <Button className="mt-4">Add new</Button>
          </DialogTrigger>
          <AddForms />
        </Dialog>
      </div>
      <ScrollArea className=" w-full max-w-[100vw]">
        <FormsList forms={data} />
        <ScrollBar />
      </ScrollArea>
    </div>
  );
}
