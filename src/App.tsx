import React, { useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import Button from "@mui/material/Button"; // MUIのボタンを使用

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
  const tableRef = useRef(null);
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
    defaultValues: {
      records: [{ id: crypto.randomUUID() }],
      inspectionData: {},
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "records",
  });
  const records = watch("records", []);
  const inspectionData = watch("inspectionData", {});

  const onSubmit = (data) => {
    console.log("検査結果:", data);
  };

  const showJson = (index) => {
    const combinedData = {
      ...records[index],
      inspectionData,
    };
    alert(JSON.stringify(combinedData, null, 2));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">検査結果登録</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <table className="w-full border-collapse border border-gray-300 mb-4">
          <thead>
            <tr className="bg-gray-100">
              {requiredFields.map((field) => (
                <th key={field.id} className="border p-2 min-w-[200px]">
                  {field.label}
                </th>
              ))}
              <th className="border p-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((row, index) => (
              <tr key={row.id}>
                {requiredFields.map((field) => (
                  <td key={field.id} className="border p-2">
                    <Input
                      type={field.type}
                      {...register(`records.${index}.${field.id}`)}
                      className="w-full"
                    />
                  </td>
                ))}
                <td className="border p-2 text-center flex gap-2">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsModalOpen(true)}
                  >
                    検査入力
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => showJson(index)}
                  >
                    JSON 確認
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => remove(index)}
                  >
                    削除
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button
          variant="contained"
          color="primary"
          onClick={() => append({ id: crypto.randomUUID() })}
        >
          行追加
        </Button>
        <Button
          variant="contained"
          color="success"
          type="submit"
          className="mt-4"
        >
          登録
        </Button>
      </form>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent size="2xl" className="!max-w-screen-2xl w-full p-8">
          <DialogHeader>検査データ入力</DialogHeader>
          <div ref={tableRef} className="overflow-x-auto w-full">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  {category.fields.map((field) => (
                    <th key={field.id} className="border p-2 min-w-[150px]">
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
                        {...register(`inspectionData.${field.id}`)}
                        className="w-full"
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
