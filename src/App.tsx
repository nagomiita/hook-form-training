import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";

const inspectionCategories = {
  blood_test: {
    name: "血液検査",
    fields: [
      { id: "hemoglobin", label: "ヘモグロビン", type: "number", unit: "g/dL" },
      { id: "rbc", label: "赤血球数", type: "number", unit: "million/µL" },
      { id: "wbc", label: "白血球数", type: "number", unit: "thousand/µL" },
      { id: "plt", label: "血小板数", type: "number", unit: "thousand/µL" },
    ],
  },
  urine_test: {
    name: "尿検査",
    fields: [
      { id: "protein", label: "タンパク", type: "text" },
      { id: "glucose", label: "グルコース", type: "text" },
      { id: "ph", label: "pH値", type: "number" },
      { id: "specific_gravity", label: "比重", type: "number" },
    ],
  },
  stool_test: {
    name: "便検査",
    fields: [
      { id: "occult_blood", label: "潜血", type: "text" },
      { id: "ph_level", label: "pHレベル", type: "number" },
    ],
  },
};

const requiredFields = [
  { id: "inspector_id", label: "検査員ID", type: "text" },
  { id: "inspection_date", label: "検査日", type: "date" },
  { id: "patient_name", label: "検査対象者名", type: "text" },
  { id: "patient_age", label: "年齢", type: "number" },
  { id: "patient_gender", label: "性別", type: "text" },
];

export default function InspectionForm() {
  const [selectedCategory, setSelectedCategory] = useState("blood_test");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const category = inspectionCategories[selectedCategory];

  const schema = z.object(
    Object.fromEntries(
      [...requiredFields, ...category.fields].map((field) => [
        field.id,
        field.type === "number" ? z.number().optional() : z.string().optional(),
      ])
    )
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { records: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "records",
  });
  const records = watch("records", []);

  const onSubmit = (data) => {
    console.log("検査結果:", data);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">検査結果登録</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        {/* requiredFieldsをテーブル形式で表示 */}
        <table className="w-full border-collapse border border-gray-300 mb-4">
          <thead>
            <tr className="bg-gray-100">
              {requiredFields.map((field) => (
                <th key={field.id} className="border p-2">
                  {field.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {requiredFields.map((field) => (
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

        {/* 検査結果入力用モーダルを呼び出すボタン */}
        <Button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          検査入力
        </Button>
        <Button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded ml-2"
        >
          登録
        </Button>
      </form>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>検査データ入力</DialogHeader>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {category.fields.map((field) => (
                  <th key={field.id} className="border p-2 min-w-[150px]">
                    {field.label} {field.unit && `(${field.unit})`}
                  </th>
                ))}
                <th className="border p-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((row, index) => (
                <tr key={row.id}>
                  {category.fields.map((field) => (
                    <td key={field.id} className="border p-2">
                      <Input
                        type={field.type}
                        {...register(`records.${index}.${field.id}`)}
                        className="w-full"
                      />
                      {errors?.records?.[index]?.[field.id] && (
                        <p className="text-red-500 text-sm">入力が必要です</p>
                      )}
                    </td>
                  ))}
                  <td className="border p-2 text-center">
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      削除
                    </Button>
                    <Button
                      type="button"
                      onClick={() =>
                        alert(JSON.stringify(records[index], null, 2))
                      }
                      className="bg-blue-500 text-white px-3 py-1 rounded ml-2"
                    >
                      JSON
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => append({ id: crypto.randomUUID() })}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              行追加
            </Button>
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
