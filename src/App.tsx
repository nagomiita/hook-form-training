import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const inspectionCategories = {
  blood_test: {
    name: "血液検査",
    fields: [
      { id: "hemoglobin", label: "ヘモグロビン", type: "number", unit: "g/dL" },
      { id: "rbc", label: "赤血球数", type: "number", unit: "million/µL" },
    ],
  },
  urine_test: {
    name: "尿検査",
    fields: [
      { id: "protein", label: "タンパク", type: "text" },
      { id: "glucose", label: "グルコース", type: "text" },
    ],
  },
};

export default function InspectionForm() {
  const [selectedCategory, setSelectedCategory] = useState("blood_test");
  const category = inspectionCategories[selectedCategory];

  const schema = z.object(
    Object.fromEntries(
      category.fields.map((field) => [
        field.id,
        field.type === "number" ? z.number() : z.string(),
      ])
    )
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("検査結果:", data);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">検査結果登録</h2>
      <Select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {Object.entries(inspectionCategories).map(([key, { name }]) => (
          <option key={key} value={key}>
            {name}
          </option>
        ))}
      </Select>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {category.fields.map((field) => (
                <th key={field.id} className="border p-2">
                  {field.label} {field.unit && `(${field.unit})`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {category.fields.map((field) => (
                <td key={field.id} className="border p-2">
                  <Input
                    type={field.type}
                    {...register(field.id)}
                    className="w-full"
                  />
                  {errors[field.id] && (
                    <p className="text-red-500 text-sm">入力が必要です</p>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <div className="mt-4 text-right">
          <Button type="submit">登録</Button>
        </div>
      </form>
    </div>
  );
}
