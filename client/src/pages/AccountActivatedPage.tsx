import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from "react-toastify";

import { useAppSelector } from '../hooks/hooks';

import { useVerifyAccountMutation, type VerifyAccountErrorResponse } from '../redux/slices/async/usersApiSlice';

import Loading from '../components/Loading';

import { backgroundColorTheme, textColorTheme, toastBackgroundTheme, toastTextTheme } from '../utils/themeUtil';
import { isFetchBaseQueryError } from '../utils/errorUtil';


function isVerifyAccountErrorResponse(data: unknown): data is VerifyAccountErrorResponse {
    return (typeof data === "object" && data !== null && ("uid" in data || "token" in data || "detail" in data));
}

const AccountActivatedPage = () => {
    const { uid, token } = useParams<{ uid: string; token: string; }>();

    const [activated, setActivated] = useState<boolean>(false);

    const hasRanOnce = useRef<boolean>(false);

    const { themeMode } = useAppSelector((state) => state.theme);

    const [verifyAccount, { isLoading: verifyAccountLoading }] = useVerifyAccountMutation();

    useEffect(() => {
        if (hasRanOnce.current) {
            return;
        }

        hasRanOnce.current = true;

        const verify = async () => {
            try {

                if (uid && token) {
                    await verifyAccount({ uid, token }).unwrap();
                    setActivated(true);
                }
                else {
                    throw new Error("uid or token or both is missing");
                }

            } catch (err) {
                if (isFetchBaseQueryError(err)) {
                    if (isVerifyAccountErrorResponse(err.data)) {
                        toast.error("Invalid verification credentials, Please re-register", { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
                        setActivated(false);
                        return;
                    }

                    console.log(err);
                    toast.error("Invalid response for verification", { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
                    setActivated(false);
                    return;
                }

                console.log(err);
                toast.error("Internal server error in verification", { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
                setActivated(false);
                return;
            }
        };

        verify();
    }, []);


    return (
        <>
            {
                verifyAccountLoading ? <Loading size={70} /> :
                    activated ?
                        <div className={`flex items-center justify-center min-h-screen ${backgroundColorTheme[themeMode]} ${textColorTheme[themeMode]}`}>
                            <div className="text-center">
                                <h1 className="text-6xl font-bold mb-4 select-none">Account Activated :)</h1>
                                <p className="text-2xl mb-8 select-none">You can login to you account now</p>
                                <Link to="/login" className={`${textColorTheme[themeMode]} hover:underline`}>
                                    Go to Login
                                </Link>
                            </div>
                        </div >
                        :
                        <div className={`flex items-center justify-center min-h-screen ${backgroundColorTheme[themeMode]} ${textColorTheme[themeMode]}`}>
                            <div className="text-center">
                                <h1 className="text-6xl font-bold mb-4">Oops :(</h1>
                                <p className="text-2xl mb-8">Account activation failed, please try again later</p>
                            </div>
                        </div >
            }
        </>
    );
};

export default AccountActivatedPage;