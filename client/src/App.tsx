// typescript applied
import { useState, useEffect } from 'react';
import { Outlet, useLocation, type Location } from "react-router-dom";
import { ToastContainer, Slide } from 'react-toastify';

import { useAppSelector } from './hooks/hooks';

import Header from './components/Header';

import { backgroundColorTheme, textColorTheme } from './utils/themeUtil';

const App = () => {
    const location: Location = useLocation();

    const [height, setHeight] = useState<number>(0);
    const [isAuthPage, setIsAuthPage] = useState<boolean>(true);

    const themeMode = useAppSelector((state) => state.theme.themeMode);

    useEffect((): void => {
        setHeight(window.innerHeight);

        const authRoutes: string[] = ['/', '/login', '/signup'] as const;
        setIsAuthPage(authRoutes.includes(location.pathname) || location.pathname.startsWith('/activate'));
    }, [location.pathname]);

    return (
        <>
            <main className={`${backgroundColorTheme[themeMode]} ${textColorTheme[themeMode]}`} style={{ height: height }}>
                {!isAuthPage && <Header />}

                <div style={{ height: isAuthPage ? height : height - 56, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    < Outlet />
                </div>

            </main>

            <ToastContainer position="top-center" transition={Slide} hideProgressBar autoClose={1500} />
        </>
    )
};

export default App;
