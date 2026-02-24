// typescript applied
import { ClipLoader } from "react-spinners";

import { useAppSelector } from "../hooks/hooks";

interface LoadingProps {
    size?: number;
}


const Loading = ({ size }: LoadingProps) => {
    const { themeMode } = useAppSelector((state) => state.theme);

    return (
        <div className="flex justify-center items-center">
            <ClipLoader size={size || 24} color={themeMode === "dark" ? "#e2e5e9" : "#65686c"} />
        </div>
    );
};

export default Loading;