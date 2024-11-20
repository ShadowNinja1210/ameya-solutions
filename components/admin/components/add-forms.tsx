"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Enum for question types
export enum QuestionType {
  TEXT = "text",
  RATING = "rating",
}

// Validation schema with Zod
const formSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().min(1, "Question cannot be empty"),
        type: z.nativeEnum(QuestionType, { required_error: "Question type is required" }),
      })
    )
    .min(1, "At least one question is required"),
});

export default function AddForms() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questions: [
        { question: "", type: QuestionType.TEXT }, // Initialize with one empty question
      ],
    },
  });

  // React Hook Form's useFieldArray to manage dynamic fields
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const onSubmit = async (values: { questions: { question: string; type: QuestionType }[] }) => {
    console.log(values);

    const payload = {
      questions: values.questions.map((q, index) => ({
        questionId: `Q${index + 1}`, // Generate questionId dynamically
        question: q.question,
        type: q.type,
      })),
    };

    const response = await fetch("/api/form", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      form.reset(); // Reset the form on successful submission
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Questions</DialogTitle>
        <DialogDescription>Fill in the details below to add new questions for the form.</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-6 gap-4 items-center">
                {/* Question ID */}
                <Label className="col-span-1">{`Q${index + 1}`}</Label>

                {/* Question Input */}
                <FormField
                  control={form.control}
                  name={`questions.${index}.question`}
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <Input {...field} placeholder={`Enter question ${index + 1}`} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Question Type */}
                <FormField
                  control={form.control}
                  name={`questions.${index}.type`}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={QuestionType.TEXT}>Text</SelectItem>
                          <SelectItem value={QuestionType.RATING}>Rating</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remove Question Button */}
                {fields.length > 1 && (
                  <Button type="button" variant="destructive" onClick={() => remove(index)} className="ml-2 col-span-1">
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Add Question Button */}
          <Button
            type="button"
            onClick={() => append({ question: "", type: QuestionType.TEXT })}
            variant="outline"
            className="w-full"
          >
            Add Question
          </Button>

          {/* Submit and Reset Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => form.reset()} type="button" variant="outline">
              Reset
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
