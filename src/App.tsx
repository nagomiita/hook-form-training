import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Button from "@mui/material/Button"; // MUIのボタンを使用
import { XIcon } from "lucide-react"; // アイコンを使用

type Field = {
  id: string;
  label: string;
  type: string;
  unit?: string;
};

type Category = {
  id: string;
  name: string;
  fields: Field[];
};

const requiredFields: Field[] = [
  { id: "inspector_id", label: "検査員ID", type: "text" },
  { id: "inspection_date", label: "検査日", type: "date" },
  { id: "patient_name", label: "検査対象者名", type: "text" },
  { id: "patient_age", label: "年齢", type: "number" },
  { id: "patient_gender", label: "性別", type: "text" },
];

const inspectionCategories: Category[] = [
  {
    id: "blood_test",
    name: "血液検査",
    fields: [
      { id: "hemoglobin", label: "ヘモグロビン", type: "number", unit: "g/dL" },
      { id: "rbc", label: "赤血球数", type: "number", unit: "million/µL" },
      { id: "wbc", label: "白血球数", type: "number", unit: "thousand/µL" },
      { id: "plt", label: "血小板数", type: "number", unit: "thousand/µL" },
    ],
  },
  {
    id: "urine_test",
    name: "尿検査",
    fields: [
      { id: "protein", label: "タンパク", type: "text" },
      { id: "glucose", label: "グルコース", type: "text" },
      { id: "ph", label: "pH値", type: "number" },
      { id: "specific_gravity", label: "比重", type: "number" },
    ],
  },
  {
    id: "stool_test",
    name: "便検査",
    fields: [
      { id: "occult_blood", label: "潜血", type: "text" },
      { id: "ph_level", label: "pHレベル", type: "number" },
    ],
  },
];

export default function InspectionForm() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("blood_test");
  const category = inspectionCategories.find(
    (cat) => cat.id === selectedCategoryId
  );

  type FormData = {
    records: {
      id: string;
      [key: string]: any;
    }[];
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      records: [
        {
          id: crypto.randomUUID(),
          inspector_id: "",
          inspection_date: "",
          patient_name: "",
          patient_age: "",
          patient_gender: "",
          ...category?.fields.reduce((acc, field) => {
            acc[field.id] = "";
            return acc;
          }, {}),
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "records",
  });

  const records = watch("records");

  const onSubmit = (data: any) => {
    console.log("検査結果:", data);
  };

  const addRow = () => {
    append({
      id: crypto.randomUUID(),
      inspector_id: "",
      inspection_date: "",
      patient_name: "",
      patient_age: "",
      patient_gender: "",
      ...category?.fields.reduce((acc, field) => {
        acc[field.id] = "";
        return acc;
      }, {}),
    });
  };

  const showJson = (index: number) => {
    alert(JSON.stringify(records[index], null, 2));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">検査結果登録</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            検査カテゴリ
          </label>
          <Select
            onValueChange={setSelectedCategoryId}
            defaultValue={selectedCategoryId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="カテゴリを選択" />
            </SelectTrigger>
            <SelectContent>
              {inspectionCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {fields.map((row, index) => (
          <div
            key={row.id}
            className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4 p-4 border rounded-md"
          >
            {requiredFields.map((field) => (
              <div key={field.id} className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <Input
                  type={field.type}
                  {...register(`records.${index}.${field.id}`)}
                  className="w-full"
                />
              </div>
            ))}
            {category?.fields.map((field) => (
              <div key={field.id} className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label} {field.unit && `(${field.unit})`}
                </label>
                <Input
                  type={field.type}
                  {...register(`records.${index}.${field.id}`)}
                  className="w-full"
                />
              </div>
            ))}
            {index > 0 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                style={{ minWidth: "auto", padding: "0.5rem" }}
              >
                <XIcon className="w-5 h-5" />
              </button>
            )}
            <Button
              variant="contained"
              color="info"
              onClick={() => showJson(index)}
              className="mt-4"
            >
              JSON 確認
            </Button>
          </div>
        ))}
        <Button
          variant="contained"
          color="primary"
          onClick={addRow}
          className="mt-4"
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
    </div>
  );
}
