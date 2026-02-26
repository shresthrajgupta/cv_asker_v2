// typescript implemented
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

import { type SignupErrorResponse } from "../redux/slices/async/usersApiSlice";

import { useAppSelector } from '../hooks/hooks';

import logo from "../assets/logo.svg";

import GreenButton from '../components/GreenButton';
import Loading from '../components/Loading';

import { useSignupMutation } from '../redux/slices/async/usersApiSlice';

import { textInputBorderColorTheme, sectionTitleTheme, contentBackgroundColor, textInputBorderColorFocusedTheme, textInputBackgroundColorTheme, toastTextTheme, toastBackgroundTheme } from "../utils/themeUtil";
import { isFetchBaseQueryError } from '../utils/errorUtil';


function isSignupErrorResponse(data: unknown): data is SignupErrorResponse {
    return (typeof data === "object" && data !== null && ("email" in data || "password" in data || "non_field_errors" in data));
}

const SignUpPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [retypePassword, setRetypePassword] = useState<string>("");

    const [isError, setIsError] = useState<boolean>(false);

    const { themeMode } = useAppSelector((state) => state.theme);

    const [signup, { isLoading: signupLoading }] = useSignupMutation();

    const handleSignupSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

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
        if (!retypePassword || retypePassword.length < 8 || retypePassword.length > 25) {
            toast.error("Password must be between 8 to 25 characters", { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
            setIsError(true);
            return;
        }
        if (password !== retypePassword) {
            toast.error("Passwords do not match", { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
            setIsError(true);
            return;
        }

        try {
            // no need to store in variable as error will automatically pass to catch block
            await signup({ email, password, re_password: retypePassword }).unwrap();

            setEmail("");
            setPassword("");
            setRetypePassword("");
            toast.success("Activation link sent to Email ID",
                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
            )
        } catch (err: unknown) {
            if (isFetchBaseQueryError(err)) {
                if (isSignupErrorResponse(err.data)) {
                    const data = err.data;

                    toast.error((data?.email?.[0] && "Email: " + data?.email[0]) || (data?.password?.[0] && "Password: " + data?.password[0]) || (data?.re_password?.[0] && "Retype Password: " + data?.re_password[0]) || (data?.non_field_errors?.[0] && "Error: " + data.non_field_errors[0]),
                        { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                    );

                    return;
                }

                else {
                    console.log(err);
                    toast.error("Server returned unexpected error");
                    return;
                }
            }

            console.log(err);
            toast.error("Network or unexpected error occurred");
            return;
        }
    };

    return (
        <>
            <div className={`flex flex-col items-center justify-center mx-4 py-6 md:w-[400px] rounded-xl ${contentBackgroundColor[themeMode]} shadow-lg`}>
                <div className="flex flex-col items-center px-6">
                    <img src={logo} alt='Logo' className="w-32" />
                    <p className={`text-xl md:text-2xl ${sectionTitleTheme[themeMode]} select-none`}>Practice smarter, answer better.</p>
                </div>

                <div className="p-6 w-full max-w-sm">
                    <form onSubmit={handleSignupSubmit}>

                        <div className="mb-4">
                            <label htmlFor="email" className="block select-none">Email:</label>
                            <input disabled={signupLoading} type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full px-3 py-2 border rounded focus:outline-none ${isError ? 'border-red-500' : textInputBorderColorTheme[themeMode]} ${textInputBorderColorFocusedTheme[themeMode]} ${textInputBackgroundColorTheme[themeMode]} ${signupLoading && "cursor-not-allowed"}`} placeholder="xyz@email.com" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block select-none">Password:</label>
                            <input disabled={signupLoading} type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full px-3 py-2 border rounded focus:outline-none ${isError ? 'border-red-500' : textInputBorderColorTheme[themeMode]} ${textInputBorderColorFocusedTheme[themeMode]} ${textInputBackgroundColorTheme[themeMode]} ${signupLoading && "cursor-not-allowed"}`} placeholder="p@sswOrd" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="retypePassword" className="block select-none">Retype Password:</label>
                            <input disabled={signupLoading} type="password" id="retypePassword" name="retypePassword" value={retypePassword} onChange={(e) => setRetypePassword(e.target.value)} className={`w-full px-3 py-2 border rounded focus:outline-none ${isError ? 'border-red-500' : textInputBorderColorTheme[themeMode]} ${textInputBorderColorFocusedTheme[themeMode]} ${textInputBackgroundColorTheme[themeMode]} ${signupLoading && "cursor-not-allowed"}`} placeholder="p@sswOrd" />
                        </div>

                        <GreenButton type="submit" disabled={signupLoading} additionalClasses="w-full" text={signupLoading ? <Loading /> : "Sign Up"} />
                    </form>
                </div>

                <div>
                    {
                        signupLoading
                            ?
                            <div className="hover:underline select-none"> Already have an account? </div>
                            :
                            <Link to="/login" className="hover:underline select-none"> Already have an account? </Link>
                    }
                </div>
            </div >
        </>
    );
};

export default SignUpPage;