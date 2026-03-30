import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAppSelector } from "../hooks/hooks";

import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import MainContainer from "../components/MainContainer";
import Overlay from "../components/Overlay";
import ContentContainer from "../components/ContentContainer";
import GreenButton from "../components/GreenButton";

import { useUpdateUserAccountInfoMutation } from "../redux/slices/async/usersApiSlice";
import { useLazyDownloadDBQuery } from "../redux/slices/async/downloadDBSlice";

import { contentBackgroundColor, textInputBackgroundColorTheme, toastBackgroundTheme, toastTextTheme } from "../utils/themeUtil";

export default function AccountPage() {
    const navigate = useNavigate();

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [activate, setActivate] = useState<string>("");

    const { themeMode } = useAppSelector((state) => state.theme);
    const { userInfo } = useAppSelector((state) => state.auth);
    const { accessToken } = useAppSelector((state) => state.accessToken);

    const [updateUserAccountInfo, { isLoading: updateUserAccountInfoLoading }] = useUpdateUserAccountInfoMutation();
    const [downloadDB, { isLoading: downloadDBLoading }] = useLazyDownloadDBQuery();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!accessToken) {
            toast.error("Invalid credentials",
                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
            );
            return;
        }

        const res = await updateUserAccountInfo({ name, accessToken }).unwrap();

        if (res?.name === name) {
            toast.success("Account updated successfully",
                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
            );
        }
        else {
            console.error("Account update response", res);
            toast.error("Error, Please try again later",
                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
            );
        }
    };

    const handleDeleteBtn = () => {
        navigate('/delete');
    };

    const handleDownloadDB = async () => {
        try {
            if (!accessToken) {
                toast.error("Invalid credentials",
                    { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                );
                return;
            }

            await downloadDB(accessToken).unwrap();
        } catch (err) {
            console.log(err);
            toast.error("Error downloading DB",
                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
            );
        }
    };


    useEffect(() => {
        if (!userInfo) {
            // toast.error("No user info present",
            //     { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
            // );
            return;
        }

        setName(userInfo.name);
        setEmail(userInfo.email);
        setActivate(userInfo.is_active === true ? "Yes" : "No");
    }, [userInfo]);

    return (
        <MainContainer>
            <Sidebar />

            <Overlay />

            <ContentContainer>
                <div className={`mx-4 p-6 md:w-4/5 lg:w-100 rounded-xl ${contentBackgroundColor[themeMode]}`}>
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-3xl mb-5 text-center select-none"> Update Account </h2>

                        <div className="mb-4">
                            <label className="my-3 text-lg select-none">Name</label>
                            <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className={`w-full p-2 rounded focus:outline-none border-none ${textInputBackgroundColorTheme[themeMode]}`} />
                        </div>

                        <div className="mb-4">
                            <label className="my-3 text-lg select-none">Email</label>
                            <input disabled type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className={`w-full cursor-not-allowed p-2 rounded focus:outline-none border-none ${textInputBackgroundColorTheme[themeMode]}`} />
                        </div>

                        <div className="mb-6">
                            <label className="my-3 text-lg select-none"> Account Activated </label>
                            <input disabled type="text" name="accountActivated" value={activate} onChange={(e) => setActivate(e.target.value)} placeholder="Yes / No" className={`w-full cursor-not-allowed p-2 rounded focus:outline-none border-none ${textInputBackgroundColorTheme[themeMode]}`} />
                        </div>

                        <GreenButton type="submit" additionalClasses="w-full mb-3" text={updateUserAccountInfoLoading ? <Loading /> : "Save"} />
                    </form>

                    {
                        userInfo?.email === "admin@admin.com" &&
                        <GreenButton type="button" onclick={handleDownloadDB} additionalClasses="w-full mb-3" text={`${downloadDBLoading ? <Loading /> : "Download DB"}`} />
                    }

                    <GreenButton type="button" onclick={handleDeleteBtn} additionalClasses="w-full bg-red-600 hover:bg-red-500" text="Delete Account" />
                </div>
            </ContentContainer>
        </MainContainer >
    );
}
