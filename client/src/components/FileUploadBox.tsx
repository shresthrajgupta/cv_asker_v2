import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "react-toastify";

import { useAppSelector } from "../hooks/hooks";

import { sectionTitleTheme, fileUploadBorderColorTheme, toastBackgroundTheme, toastTextTheme } from "../utils/themeUtil";

type FileUploadBoxProps = {
    onFileSelect: (file: File) => void;
};


const FileUploadBox = ({ onFileSelect }: FileUploadBoxProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [fileName, setFileName] = useState<string>("");

    const { themeMode } = useAppSelector((state) => state.theme);

    const handleDivClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            toast.error("Please select a file",
                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
            )
            return;
        }

        if (file.type !== "application/pdf") {
            toast.error("Only PDFs are supported",
                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
            );
            return;
        }

        setFileName(file.name);
        onFileSelect(file);
    };

    return (
        <div title="PDF Upload Box">
            <div onClick={handleDivClick} className={`border-2 border-dashed p-6 text-center cursor-pointer rounded-xl ${fileUploadBorderColorTheme[themeMode]}`}>
                {fileName ? (<p className="text-green-600">{fileName}</p>) : (<p className={`select-none ${sectionTitleTheme[themeMode]}`}>Click here to upload a PDF</p>)}
            </div>

            <input type="file" accept="application/pdf" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>
    );
};

export default FileUploadBox;
