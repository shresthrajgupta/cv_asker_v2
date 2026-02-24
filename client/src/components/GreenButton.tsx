// typescript applied
import { type MouseEventHandler, type ReactElement } from "react";

import { useAppSelector } from "../hooks/hooks";

import Loading from "./Loading";

import { buttonColorTheme } from "../utils/themeUtil";

interface GreenButtonProps {
    text: string | ReactElement<typeof Loading>;
    type: "submit";
    onclick?: MouseEventHandler<HTMLButtonElement>;
    disabled: boolean;
    additionalClasses: string;
};


const GreenButton = ({ text, type, onclick, disabled, additionalClasses = "", }: GreenButtonProps) => {
    const { themeMode } = useAppSelector((state) => state.theme);

    return (
        <button onClick={onclick} type={type} disabled={disabled} className={`${buttonColorTheme[themeMode]} text-white hover:opacity-85 disabled:opacity-50 p-2 rounded focus:outline-none flex justify-center items-center transition ${additionalClasses}`} >
            {text}
        </button>
    );
};

export default GreenButton;
