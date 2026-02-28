import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Home, ScrollText, User } from "lucide-react";
import { toast } from "react-toastify";

import { useAppSelector, useAppDispatch } from "../hooks/hooks";

import { navbarItemHoverColor, contentBackgroundColor, sidebarBackgroundColor, toastBackgroundTheme, toastTextTheme } from "../utils/themeUtil";

import { useLogoutMutation } from "../redux/slices/async/usersApiSlice";

import { setSidebarOpen } from "../redux/slices/sync/sidebarOpenSlice";
import { setCredentials } from "../redux/slices/sync/authSlice";
import { setAccessToken } from "../redux/slices/sync/accessTokenSlice";


type SidebarElement = {
    icon: React.ReactNode;
    text: string;
    to: string;
};

const sidebarElements: SidebarElement[] = [
    {
        icon: <Home size={22} />,
        text: "Home",
        to: "/home"
    },
    {
        icon: <ScrollText size={22} />,
        text: "Upload Resume",
        to: "/upload"
    },
    {
        icon: <GraduationCap size={22} />,
        text: "Practice",
        to: "/practice"
    },
];

export default function Sidebar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [openUserMenu, setOpenUserMenu] = useState<boolean>(false);

    const { themeMode } = useAppSelector((state) => state.theme);
    const { userInfo } = useAppSelector((state) => state.auth);
    const { sidebarOpen } = useAppSelector((state) => state.sidebarOpen);
    const { accessToken } = useAppSelector((state) => state.accessToken);

    const [logout] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            if (!accessToken) {
                toast.error("Invalid access token", { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
                return;
            }
        
            await logout({ accessToken }).unwrap();

            dispatch(setCredentials(null));
            dispatch(setAccessToken(null));

            navigate('/login');
            // window.location.reload();
        } catch (err) {
            console.log(err);
            toast.error("Internal server error", { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
        }
    };

    return (
        <div className={`fixed md:relative shadow top-0 left-0 h-full w-4/5 md:w-auto md:basis-1/5 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`} style={{ zIndex: 50 }} >
            <div className={`flex flex-col w-full min-w-48 min-h-full justify-between ${sidebarBackgroundColor[themeMode]} pl-1`}>
                <div className="flex flex-col my-6 h-full w-full overflow-y-auto">
                    {sidebarElements.map((element) => (
                        <div key={element.to} onClick={() => dispatch(setSidebarOpen(false))} className="w-full">
                            <Link to={element.to} className={`flex flex-row gap-2 pl-3 py-3 justify-self-start rounded-xl w-full ${navbarItemHoverColor[themeMode]}`}>
                                {element.icon}
                                <p> {element.text} </p>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Bottom section */}
                <div className={`relative py-3 mb-1 pl-3 flex w-full cursor-pointer select-none ${navbarItemHoverColor[themeMode]} rounded-xl`} onClick={() => setOpenUserMenu(prev => !prev)}>
                    <div className={`flex flex-row gap-2`}>
                        <User size={22} />
                        <p>{userInfo?.email?.split('@')[0]}</p>
                    </div>

                    {/* Popup Menu */}
                    {openUserMenu && (
                        <div onClick={(e) => { e.stopPropagation(); dispatch(setSidebarOpen(false)) }} className={`absolute bottom-14 left-26 -translate-x-1/2 ${contentBackgroundColor[themeMode]} rounded-xl shadow-lg py-2 w-48 z-10`}>
                            <Link to={"/account"} className={`block w-full text-left px-4 py-2 cursor-pointer ${navbarItemHoverColor[themeMode]}`}> Account </Link>

                            <Link to={"/profile"} className={`block w-full text-left px-4 py-2 cursor-pointer ${navbarItemHoverColor[themeMode]}`}> Profile </Link>

                            <button onClick={(e) => { e.stopPropagation(); handleLogout(); }} className={`block w-full text-left px-4 py-2 text-red-400 cursor-pointer ${navbarItemHoverColor[themeMode]}`}> Logout </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
