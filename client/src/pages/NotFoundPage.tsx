import { Link } from 'react-router-dom';

import { useAppSelector } from '../hooks/hooks.js';

import { backgroundColorTheme, textColorTheme } from '../utils/themeUtil.js';

const NotFoundPage = () => {
    const { themeMode } = useAppSelector((state) => state.theme);

    return (
        <div className={`flex items-center justify-center min-h-screen ${backgroundColorTheme[themeMode]} ${textColorTheme[themeMode]}`}>
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-4">404 :(</h1>
                <p className="text-2xl mb-8">Page Not Found</p>
                <Link to="/home" className={`${textColorTheme[themeMode]} hover:underline`}>
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;