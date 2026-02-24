import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { type FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { useAppSelector, useAppDispatch } from '../hooks/hooks';

import logo from "../assets/logo.svg";

import GreenButton from '../components/GreenButton';
import Loading from '../components/Loading';

import { useLoginMutation, useLazyUserAccountInfoQuery, useGetAccessTokenMutation } from '../redux/slices/async/usersApiSlice';

import { setAccessToken } from '../redux/slices/sync/accessTokenSlice.js';
import { setCredentials } from '../redux/slices/sync/authSlice.js';

import { contentBackgroundColor, sectionTitleTheme, textInputBorderColorTheme, textInputBorderColorFocusedTheme, textInputBackgroundColorTheme, toastBackgroundTheme, toastTextTheme } from '../utils/themeUtil';


const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isError, setIsError] = useState<boolean>(false);

    const [login, { isLoading: loginLoading }] = useLoginMutation();
    const [userAccount, { isFetching: userAccountInfoFetching }] = useLazyUserAccountInfoQuery();
    const [getAccessToken, { isLoading: getAccessTokenLoading }] = useGetAccessTokenMutation();

    const { userInfo } = useAppSelector((state) => state.auth);
    const { themeMode } = useAppSelector((state) => state.theme);

    useEffect(() => {
        const tryLogin = async () => {
            const accessTokenResponse = await getAccessToken().unwrap();

            if (accessTokenResponse.access) {
                dispatch(setAccessToken(accessTokenResponse.access));

                const userAccountInfo = await userAccount(accessTokenResponse.access).unwrap();

                dispatch(setCredentials({ ...userAccountInfo }));
            }
        };

        tryLogin();
    }, []);

    useEffect(() => {
        if (userInfo) {
            navigate('/home');
        }
    }, [userInfo]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        setIsError(false);

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            toast.error("Enter valid email", { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
            setIsError(true);
            return;
        }
        if (!password || password.length < 8 || password.length > 25) {
            toast.error("Password must be between 8 to 25 characters", { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
            setIsError(true);
            return;
        }

        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setAccessToken(res.access));

            const userAccountInfo = await userAccount(res.access).unwrap();
            dispatch(setCredentials({ ...userAccountInfo }));

            navigate("/home");
        } catch (err) {
            const error = err as FetchBaseQueryError;

            if (error.status && (typeof error.status === "number") && (Math.floor(error.status / 100) === 4)) {
                toast.error("Incorrect username or password",
                    { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                )
            }
            else {
                console.log("login page handleSubmit error", error);
                toast.error("Internal server error, please try again later",
                    { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                )
            }
        }
    };

    return (
        (userAccountInfoFetching || getAccessTokenLoading) ? <Loading size={70} /> :
            <div className={`flex flex-col items-center justify-center mx-4 py-6 md:w-[400px] rounded-xl ${contentBackgroundColor[themeMode]} shadow-lg`}>
                <div className="flex flex-col items-center px-6">
                    <img src={logo} alt='Logo' className="w-32" />
                    <p className={`text-xl md:text-2xl ${sectionTitleTheme[themeMode]} select-none`}>Log in to CV-Asker</p>
                </div>

                <div className="p-6 w-full max-w-sm">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block select-none">Email:</label>
                            <input type="email" id="email" name="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} className={`w-full px-3 py-2 border rounded focus:outline-none ${isError ? 'border-red-500' : textInputBorderColorTheme[themeMode]} ${textInputBorderColorFocusedTheme[themeMode]} ${textInputBackgroundColorTheme[themeMode]}`} placeholder="xyz@email.com" required />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block select-none">Password:</label>
                            <input type="password" id="password" name="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} className={`w-full px-3 py-2 border rounded focus:outline-none ${isError ? 'border-red-500' : textInputBorderColorTheme[themeMode]} ${textInputBorderColorFocusedTheme[themeMode]} ${textInputBackgroundColorTheme[themeMode]}`} placeholder="p@sswOrd" required />
                        </div>

                        <GreenButton type="submit" disabled={loginLoading} additionalClasses="w-full" text={loginLoading ? <Loading /> : "Log In"} />
                    </form>
                </div>

                <div> <Link to="/password-reset" className="hover:underline select-none" > Forgot Password? </Link> </div>
                <div> <Link to="/signup" className="hover:underline select-none"> Don't have an account? </Link> </div>
            </div>
    );
};

export default LoginPage;