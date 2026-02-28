import { useAppSelector, useAppDispatch } from "../hooks/hooks";

import { overlayTheme } from "../utils/themeUtil";

import { setSidebarOpen } from "../redux/slices/sync/sidebarOpenSlice";

const Overlay = () => {
    const dispatch = useAppDispatch();

    const { themeMode } = useAppSelector((state) => state.theme);
    const { sidebarOpen } = useAppSelector((state) => state.sidebarOpen);

    return (
        <div className={`fixed inset-0 ${overlayTheme[themeMode]} bg-opacity-50 transition-opacity duration-300  ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} md:hidden`} style={{ zIndex: 40 }} onClick={() => dispatch(setSidebarOpen(false))} />
    );
};

export default Overlay;