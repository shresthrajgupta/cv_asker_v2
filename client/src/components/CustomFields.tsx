import { useState } from "react";
import { Plus, Trash } from "lucide-react";

import { useAppSelector } from "../hooks/hooks";

import Loading from "./Loading";
import GreenButton from "./GreenButton";

import { textColorTheme, contentBackgroundColor, textInputBackgroundColorTheme } from "../utils/themeUtil";


type CustomField = { key: string; value: string; };

interface CustomFieldsProps {
    setCustomFields: (fields: Record<string, string>[]) => void;
    disableSubmitBtn: boolean;
};

const placeholdersArray: Record<string, string>[] = [{ "College": "Indian Institute of Technology Kharagpur" }, { "Company": "ABC Pvt. Ltd." }, { "Company 2": "XYX Pvt. Ltd." }, { "Category": "Actual Value" }];
// let placeholdersIndex = 0;

const CustomFields = ({ setCustomFields, disableSubmitBtn }: CustomFieldsProps) => {
    const [fields, setFields] = useState<CustomField[]>([{ key: "", value: "" }]);
    const [placeholdersIndex, setPlaceholdersIndex] = useState<number>(0);

    const { themeMode } = useAppSelector((state) => state.theme);

    const handleChange = (index: number, field: keyof CustomField, newValue: string) => {
        const updatedFields = [...fields];
        updatedFields[index][field] = newValue;
        setFields(updatedFields);
    };

    const addField = () => {
        // placeholdersIndex = Math.min(placeholdersIndex + 1, placeholdersArray.length - 1);
        // const lastField = fields.at(-1);
        setPlaceholdersIndex(prev =>
            Math.min(prev + 1, placeholdersArray.length - 1)
        );
        const lastField = fields.at(-1);

        if (lastField?.key && lastField?.value) {
            setFields(prev => [...prev, { key: "", value: "" }]);
        }
    };

    const removeField = (index: number) => {
        const updatedFields = fields.filter((_, i) => i !== index);
        setFields(updatedFields.length > 0 ? updatedFields : [{ key: "", value: "" }]);
    };

    const handleSubmit = () => {
        const result = fields
            .filter(f => f.key.trim() && f.value.trim())
            .map(f => ({ [f.key]: f.value }));

        setCustomFields(result);
    };

    return (
        <div className={`p-6 ${contentBackgroundColor[themeMode]} rounded-xl shadow-lg md:w-4/5 lg:w-3/5 space-y-4 max-h-4/5 overflow-y-auto`}>
            <h2 className="py-3 text-lg text-center select-none">This tool automatically captures key personal info. You can also remove any sensitive fields before processing. Please enter exact values as mentioned in resume.</h2>

            <h2 className="my-3 text-lg font-semibold select-none">Enter Info</h2>
            {fields.map((field, index) => (
                <div key={index} className="flex gap-2 w-full">
                    <input type="text" disabled={disableSubmitBtn} placeholder={Object.keys(placeholdersArray[placeholdersIndex])[0]} value={field.key} onChange={(e) => handleChange(index, "key", e.target.value)} className={`lg:w-1/3 min-w-[30] border p-2 rounded border-none focus:outline-none ${textInputBackgroundColorTheme[themeMode]} ${disableSubmitBtn && "cursor-not-allowed"}`} />

                    <input type="text" disabled={disableSubmitBtn} placeholder={Object.values(placeholdersArray[placeholdersIndex])[0]} value={field.value} onChange={(e) => handleChange(index, "value", e.target.value)} className={`w-3/5 border p-2 rounded border-none focus:outline-none ${textInputBackgroundColorTheme[themeMode]} ${disableSubmitBtn && "cursor-not-allowed"}`} />

                    <button type="button" disabled={disableSubmitBtn} onClick={() => removeField(index)} className={`min-w-10 pl-2 py-2 text-red-500 ${!disableSubmitBtn && "hover:text-red-700"} flex justify-end`} > <Trash size={22} /> </button>
                </div>
            ))
            }

            <button type="button" disabled={disableSubmitBtn} onClick={addField} className={`flex items-center gap-2 select-none ${textColorTheme[themeMode]} ${!disableSubmitBtn && "hover:underline"}`} >
                <Plus size={18} /> Add Field
            </button>

            <GreenButton text={disableSubmitBtn ? <Loading /> : "Submit"} type="button" disabled={disableSubmitBtn} onclick={handleSubmit} additionalClasses="px-4" />
        </div >
    );
};

export default CustomFields;
