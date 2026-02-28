import { type PropsWithChildren } from "react";


const MainContainer = ({ children }: PropsWithChildren) => {
    return (
        <div className="relative flex h-full w-full">
            {children}
        </div>
    );
};

export default MainContainer;