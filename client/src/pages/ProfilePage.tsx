import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useAppSelector } from "../hooks/hooks";

import Sidebar from "../components/Sidebar";
import SkillProficiency from "../components/SkillProficiency";
import Loading from "../components/Loading";
import MainContainer from "../components/MainContainer";
import Overlay from "../components/Overlay";
import ContentContainer from "../components/ContentContainer";

import { useLazyGetProfileQuery, usePatchProfileMutation } from "../redux/slices/async/profileApiSlice";

import { toastBackgroundTheme, toastTextTheme } from "../utils/themeUtil";

import { type Profile } from "../redux/slices/async/profileApiSlice";

const ProfilePage = () => {
    const [profileModified, setProfileModified] = useState<Profile | null>(null);
    const [buttonClicked, setButtonClicked] = useState(false);

    const { accessToken } = useAppSelector((state) => state.accessToken);
    const { themeMode } = useAppSelector((state) => state.theme);

    const [getProfile, { data: getProfileData, isLoading: getProfileLoading }] = useLazyGetProfileQuery();
    const [patchProfile, { isLoading: patchProfileLoading }] = usePatchProfileMutation();

    useEffect(() => {
        const fetchData = async () => {
            if (accessToken !== "") {
                try {
                    if (!accessToken) {
                        // toast.error("Invalid credentials",
                        //     { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                        // );
                        return;
                    }

                    await getProfile(accessToken).unwrap();
                } catch (err) {
                    console.log(err);
                }
            }
        };
        fetchData();
    }, [accessToken]);

    useEffect(() => {
        if (!getProfileData) {
            // toast.error("Error loading profile",
            //     { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
            // );
            return;
        }

        if (getProfileData.skills?.length > 0) {
            // setProfile({ "Experience Level": getProfileData.experience_years, Skills: getProfileData.skills, jobProfile: getProfileData.job_profile });
            setProfileModified({ experience_years: getProfileData.experience_years, skills: getProfileData.skills, job_profile: getProfileData.job_profile });
        }
    }, [getProfileData]);

    useEffect(() => {
        const updateProfile = async () => {
            if (buttonClicked) {
                try {
                    if (!profileModified) {
                        // toast.error("No profile present",
                        //     { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                        // );
                        return;
                    }

                    if (!accessToken) {
                        toast.error("Invalid credentials",
                            { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                        );
                        return;
                    }

                    setProfileModified({ skills: profileModified.skills, experience_years: profileModified.experience_years, job_profile: profileModified.job_profile });
                } catch (err) {
                    console.log(err);
                }
            }
            setButtonClicked(false);
        }

        updateProfile();
    }, [buttonClicked]);

    useEffect(() => {
        const updateAndPatchProfile = async () => {
            if (!buttonClicked) return;

            if (!profileModified) {
                // toast.error("No profile present",
                //     { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                // );
                return;
            }

            if (!accessToken) {
                toast.error("Invalid credentials",
                    { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                );
                return;
            }

            try {
                const res = await patchProfile({ profile: profileModified, accessToken });

                if (res.data && res.data.message === "Profile updated") {
                    toast.success("Profile updated successfully",
                        { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                    )
                }
                else {
                    toast.error("Error updating profile",
                        { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                    );
                }
            }
            catch (err) {
                console.log(err);
            }

            setButtonClicked(false);
        }

        updateAndPatchProfile();
    }, [buttonClicked, profileModified]);

    return (
        <MainContainer>
            <Sidebar />

            <Overlay />

            <ContentContainer>
                {
                    getProfileLoading ? <Loading size={70} /> :
                        <SkillProficiency profile={profileModified} setProfile={setProfileModified} disableSubmitBtn={patchProfileLoading} isGetProfilePage={true} setButtonClicked={setButtonClicked} />
                }
            </ContentContainer>
        </MainContainer>
    );
};

export default ProfilePage;