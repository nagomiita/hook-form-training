import { useState } from "react";
import TextField from "@mui/material/TextField";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Button from "@mui/material/Button"; // MUIのボタンを使用
import { XIcon } from "lucide-react"; // アイコンを使用
import AddIcon from "@mui/icons-material/Add";
import { Input } from "@/components/ui/input"; // カスタムコンポーネントをインポート
import { ButtonInput } from "@/components/ui/buttonInput"; // ボタン付き入力フォームをインポート

type Field = {
  id: string;
  label: string;
  type: string;
  component: string;
};

type Category = {
  id: string;
  name: string;
  fields: Field[];
};

const requiredFields: Field[] = [
  {
    id: "inspector_id",
    label: "検査員ID",
    type: "text",
    component: "TextField",
  },
  {
    id: "inspection_date",
    label: "検査日",
    type: "date",
    component: "TextField",
  },
  {
    id: "patient_name",
    label: "検査対象者名",
    type: "text",
    component: "TextField",
  },
  { id: "patient_age", label: "年齢", type: "number", component: "TextField" },
  { id: "patient_gender", label: "性別", type: "text", component: "TextField" },
  {
    id: "patient_count",
    label: "受診回数",
    type: "number",
    component: "TextField",
  },
  {
    id: "custom_input",
    label: "カスタム入力",
    type: "text",
    component: "ButtonInput",
  },
];

const inspectionCategories: Category[] = [
  {
    id: "blood_test",
    name: "血液検査",
    fields: [
      {
        id: "hemoglobin",
        label: "ヘモグロビン",
        type: "number",
        component: "TextField",
      },
      { id: "rbc", label: "赤血球数", type: "number", component: "TextField" },
      { id: "wbc", label: "白血球数", type: "number", component: "TextField" },
      { id: "plt", label: "血小板数", type: "number", component: "TextField" },
    ],
  },
  {
    id: "urine_test",
    name: "尿検査",
    fields: [
      {
        id: "protein",
        label: "タンパク",
        type: "text",
        component: "TextField",
      },
      {
        id: "glucose",
        label: "グルコース",
        type: "text",
        component: "TextField",
      },
      { id: "ph", label: "pH値", type: "number", component: "TextField" },
      {
        id: "specific_gravity",
        label: "比重",
        type: "number",
        component: "TextField",
      },
    ],
  },
  {
    id: "stool_test",
    name: "便検査",
    fields: [
      {
        id: "occult_blood",
        label: "潜血",
        type: "text",
        component: "TextField",
      },
      {
        id: "ph_level",
        label: "pHレベル",
        type: "number",
        component: "TextField",
      },
    ],
  },
];

export default function InspectionForm() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("blood_test");
  const category = inspectionCategories.find(
    (cat) => cat.id === selectedCategoryId
  );
  const categoryFields = category?.fields || [];

  const [records, setRecords] = useState<{ [key: string]: any }[]>([
    {
      id: crypto.randomUUID(),
      ...requiredFields.reduce((acc: { [key: string]: any }, field) => {
        acc[field.id] = "";
        return acc;
      }, {}),
      ...categoryFields.reduce((acc: { [key: string]: any }, field) => {
        acc[field.id] = "";
        return acc;
      }, {}),
    },
  ]);

  const handleInputChange = (index: number, fieldId: string, value: any) => {
    const newRecords = [...records];
    newRecords[index][fieldId] = value;
    setRecords(newRecords);
  };

  const addRow = () => {
    setRecords([
      ...records,
      {
        id: crypto.randomUUID(),
        ...requiredFields.reduce((acc: { [key: string]: any }, field) => {
          acc[field.id] = "";
          return acc;
        }, {}),
        ...categoryFields.reduce((acc: { [key: string]: any }, field) => {
          acc[field.id] = "";
          return acc;
        }, {}),
      },
    ]);
  };

  const removeRow = (index: number) => {
    const newRecords = records.filter((_, i) => i !== index);
    setRecords(newRecords);
  };

  const showJson = (index: number) => {
    alert(JSON.stringify(records[index], null, 2));
  };

  const saveDraft = () => {
    console.log("一時保存:", records);
  };

  const handleButtonClick = () => {
    alert("Button clicked!");
  };

  const renderField = (field: Field, index: number) => {
    const value = records[index][field.id];
    switch (field.component) {
      case "TextField":
        return (
          <TextField
            label={field.label}
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(index, field.id, e.target.value)}
            fullWidth
            slotProps={{
              inputLabel: field.type === "date" ? { shrink: true } : undefined,
            }}
          />
        );
      case "Input":
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(index, field.id, e.target.value)}
          />
        );
      case "ButtonInput":
        return (
          <ButtonInput
            label={field.label}
            type={field.type}
            onButtonClick={handleButtonClick}
            value={value}
            onChange={(e) => handleInputChange(index, field.id, e.target.value)}
          />
        );
      // 他のカスタムコンポーネントを追加する場合はここに追加
      default:
        return null;
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("検査結果:", records);
  };

  return (
    <div className="p-4 w-full mx-auto">
      <h2 className="text-xl font-bold mb-4">検査結果登録</h2>
      <form onSubmit={handleSubmit} className="mt-4">
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
        {records.map((row, index) => (
          <div
            key={row.id}
            className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4 p-7 border rounded-md"
          >
            {requiredFields.map((field) => (
              <div key={field.id} className="mb-4">
                {renderField(field, index)}
              </div>
            ))}
            {category?.fields.map((field) => (
              <div key={field.id} className="mb-4">
                {renderField(field, index)}
              </div>
            ))}
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeRow(index)}
                className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
                style={{ minWidth: "auto", padding: "0.01rem" }}
              >
                <XIcon className="w-5 h-5" />
              </button>
            )}
            <Button
              variant="contained"
              color="info"
              onClick={() => showJson(index)}
              className="h-[77%] w-full"
              fullWidth
            >
              JSON
            </Button>
          </div>
        ))}
        <div className="flex justify-between mt-4">
          <Button
            variant="contained"
            color="primary"
            onClick={addRow}
            className="mt-4"
          >
            <AddIcon />
          </Button>
          <div className="flex gap-4">
            <Button
              variant="contained"
              color="secondary"
              onClick={saveDraft}
              className="mt-4"
            >
              一時保存
            </Button>
            <Button
              variant="contained"
              color="success"
              type="submit"
              className="mt-4"
            >
              登録
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
