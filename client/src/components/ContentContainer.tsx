import { type PropsWithChildren } from "react";

import { useAppSelector } from "../hooks/hooks";


const ContentContainer = ({ children }: PropsWithChildren) => {
    const { sidebarOpen } = useAppSelector((state) => state.sidebarOpen);

    return (
        <div className={`overflow-y-auto px-4 my-6 flex flex-col w-full items-center transition-all duration-300  ${sidebarOpen ? 'pointer-events-none select-none blur-[2px]' : 'pointer-events-auto'}`}>
            {children}
        </div>
    );
};

export default ContentContainer;