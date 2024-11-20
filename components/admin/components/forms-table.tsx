"use client";

// Dependencies
import { useEffect, useState } from "react";
import _ from "lodash";
import { format } from "date-fns/format";

// Types
import { IForm } from "@/lib/schema";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function FormsList({ forms }: Readonly<{ forms: IForm[] }>) {
  const [sorting, setSorting] = useState("asc");
  const [searchId, setSearchId] = useState("");
  const [filteredForms, setFilteredForms] = useState<IForm[]>(forms);

  useEffect(() => {
    const filteredData = forms.filter((form) => form.formId.includes(searchId));
    console.log(filteredData);
    console.log(searchId);
    setFilteredForms(filteredData);
  }, [searchId]);

  useEffect(() => {
    const sortedForms = _.sortBy(filteredForms, ["createdAt"]);
    if (sorting === "desc") {
      sortedForms.reverse();
    }
    setFilteredForms(sortedForms);
  }, [sorting]);

  return (
    <div className="w-full container">
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filter Form ID (FORM-XXXXXXXX)..."
          className="max-w-sm"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value.toUpperCase())}
        />
        <div className="flex items-center gap-4">
          <Select onValueChange={setSorting} defaultValue="asc">
            <SelectTrigger className="font-medium">
              <SelectValue className=""></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Latest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border text-left">
        <Accordion type="single" collapsible className="min-w-[800px]">
          {filteredForms.map((form, index) => (
            <AccordionItem value={`item-${index}`}>
              <AccordionTrigger
                className={cn("flex items-center justify-between w-full px-4", index % 2 === 0 ? "bg-neutral-200" : "")}
              >
                <span>{form.formId}</span>
                <span>{format(form.createdAt, "PPp")}</span>
              </AccordionTrigger>
              <AccordionContent className={cn("flex flex-col gap-1 px-4 py-2")}>
                {form.questions.map((question) => (
                  <div className="flex justify-between items-center">
                    <p>
                      <span className="font-bold mr-2">{question.questionId}</span>
                      <span>{question.question}</span>
                    </p>
                    <Badge
                      className={cn(
                        "capitalize hover:bg-black",
                        question.type === "text" ? "bg-blue-700" : "bg-red-700"
                      )}
                    >
                      {question.type}
                    </Badge>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
