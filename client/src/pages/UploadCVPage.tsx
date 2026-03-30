import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { useAppSelector } from "../hooks/hooks";
import useWarningReload from "../hooks/WarningReload";

import Sidebar from "../components/Sidebar";
import FileUploadBox from "../components/FileUploadBox";
import CustomFields from "../components/CustomFields";
import SkillProficiency from "../components/SkillProficiency";
import Overlay from "../components/Overlay";
import MainContainer from "../components/MainContainer";
import ContentContainer from "../components/ContentContainer";

import { useUploadPDFMutation } from "../redux/slices/async/cvApiSlice";
import { useSaveProfileMutation } from "../redux/slices/async/profileApiSlice";

import { contentBackgroundColor, toastBackgroundTheme, toastTextTheme, greenTextHoverTheme } from "../utils/themeUtil"
import { isFetchBaseQueryError } from "../utils/errorUtil";

import { type UploadPDFErrorResponse } from "../redux/slices/async/cvApiSlice";
import { type Skill, type Profile, type SaveProfileErrorResponse } from "../redux/slices/async/profileApiSlice";

interface SkillType {
    name: string;
    proficiency?: number;
}

export interface ProfileInterface {
    skills: SkillType[];
    job_profile?: string;
    experience_years: number;
}


function isUploadPDFErrorResponse(data: unknown): data is UploadPDFErrorResponse {
    return (typeof data === "object" && data !== null && ("detail" in data || "file" in data || "custom_fields" in data));
};

function isSaveProfileErrorResponse(data: unknown): data is SaveProfileErrorResponse {
    return (typeof data === "object" && data !== null && ("detail" in data || "skills" in data || "job_profile" in data || "experience_years" in data));
};

function everySkillHasProficiency(skill: SkillType): skill is Skill {
    return typeof skill.proficiency === "number";
};

function isValidProfile(profile: ProfileInterface): profile is Profile {
    return (typeof profile.job_profile === "string" && profile.skills.every(everySkillHasProficiency));
};

const UploadCVPage = () => {
    const [isUploadSection, setIsUploadSection] = useState<boolean>(true);
    const [isCustomFieldsSection, setIsCustomFieldsSection] = useState<boolean>(false);
    const [isExtractedDataSection, setIsExtractedDataSection] = useState<boolean>(false);

    const [file, setFile] = useState<File | null>(null);
    const [customFields, setCustomFields] = useState<Record<string, string>[]>([]);
    const [profile, setProfile] = useState<ProfileInterface | null>(null);

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
    useWarningReload(hasUnsavedChanges);

    const { themeMode } = useAppSelector((state) => state.theme);
    const { accessToken } = useAppSelector((state) => state.accessToken);

    const [uploadPDF, { isLoading: uploadPDFLoading }] = useUploadPDFMutation();
    const [saveProfile, { isLoading: saveProfileLoading }] = useSaveProfileMutation();

    const skipCVUpload = () => {
        setFile(null);
        setCustomFields([]);
        setProfile(null);

        setIsUploadSection(false);
        setIsCustomFieldsSection(false);
        setIsExtractedDataSection(true);
    };

    useEffect(() => {
        if (file) {
            setIsUploadSection(false);
            setIsCustomFieldsSection(true);
            setIsExtractedDataSection(false);

            setHasUnsavedChanges(true);
        }
        else {
            setIsUploadSection(true);
            setIsCustomFieldsSection(false);
            setIsExtractedDataSection(false);

            setHasUnsavedChanges(false);
        }
    }, [file]);

    useEffect(() => {
        const extractSkills = async () => {
            if (customFields.length > 0) {
                try {
                    if (!file) {
                        toast.error("File not selected",
                            { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                        );
                        return;
                    }

                    if (!accessToken) {
                        toast.error("Invalid credentials",
                            { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                        );
                        return;
                    }

                    const res = await uploadPDF({ file: file, custom_fields: customFields, accessToken }).unwrap();

                    setProfile({
                        experience_years: res.data["Experience Level"],
                        skills: res.data.Skills.map((skill: string) => ({
                            name: skill
                        }))
                    });

                    setIsUploadSection(false);
                    setIsCustomFieldsSection(false);
                    setIsExtractedDataSection(true);


                } catch (err: unknown) {
                    setIsUploadSection(false);
                    setIsCustomFieldsSection(true);
                    setIsExtractedDataSection(false);

                    if (isFetchBaseQueryError(err)) {
                        if (isUploadPDFErrorResponse(err.data)) {
                            const data = err.data;

                            toast.error((data?.detail && "Detail: " + data?.detail) || (data?.file?.[0] && "Password: " + data?.file[0]) || (data?.custom_fields?.[0] && "Retype Password: " + data?.custom_fields[0]),
                                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                            );

                            return;
                        }

                        console.error(err);
                        toast.error("Error extracting skills, Please try again",
                            { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                        );

                        return;
                    }

                    console.log(err);
                    toast.error("Internal server error",
                        { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                    );
                }
            }
        }

        extractSkills();
    }, [customFields]);

    useEffect(() => {
        const finishProfile = async () => {
            if (!profile || profile.skills.length === 0) {
                // toast.error("Please provide at least 1 skill",
                //     { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                // );
                return;
            }

            if (isValidProfile(profile)) {
                if (!accessToken) {
                    toast.error("Invalid credentials",
                        { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                    );
                    return;
                }

                if (!profile.skills.every(everySkillHasProficiency)) {
                    toast.error("Please put proficiency in all fields",
                        { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                    );
                    return;
                }

                try {
                    await saveProfile({ profile, accessToken }).unwrap();

                    setIsUploadSection(true);
                    setIsCustomFieldsSection(false);
                    setIsExtractedDataSection(false);

                    toast.success("Profile created successfully",
                        { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                    );

                    setFile(null);
                    setCustomFields([]);
                    setProfile(null);
                } catch (err) {
                    if (isFetchBaseQueryError(err)) {
                        if (isSaveProfileErrorResponse(err.data)) {
                            toast.error((err.data?.detail && "Detail: " + err.data?.detail) || (err.data?.skills?.[0] && "Skills: " + err.data?.skills[0]) || (err.data?.job_profile?.[0] && "Job Profile: " + err.data?.job_profile[0]) || (err.data?.experience_years?.[0] && "Years of Experience: " + err.data?.experience_years[0]),
                                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                            );
                            setIsUploadSection(false);
                            setIsCustomFieldsSection(false);
                            setIsExtractedDataSection(true);
                            return;
                        }

                        console.log(err);
                        toast.error("Error saving profile, please try again",
                            { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                        );
                        setIsUploadSection(false);
                        setIsCustomFieldsSection(false);
                        setIsExtractedDataSection(true);
                        return;
                    }

                    setIsUploadSection(false);
                    setIsCustomFieldsSection(false);
                    setIsExtractedDataSection(true);

                    console.log(err);
                    toast.error("Internal server error",
                        { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                    );
                }
            }
            else {
                toast.error("Invalid profile format",
                    { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                );

                setProfile({ ...profile });

                setIsUploadSection(false);
                setIsCustomFieldsSection(false);
                setIsExtractedDataSection(true);
            }

        }

        finishProfile();
    }, [profile]);

    return (
        <MainContainer>
            <Sidebar />

            <Overlay />

            <ContentContainer>
                {isUploadSection && (
                    <div className={`mx-4 p-6 shadow-lg md:min-w-125 md:max-w-[95%] rounded-xl ${contentBackgroundColor[themeMode]}`} >
                        <p className="text-xl mb-5 text-center select-none">
                            You can upload your CV without any worries. <br /> This tool will not use your personal
                            information for anything
                        </p>

                        <FileUploadBox onFileSelect={(file) => setFile(file)} />

                        <div onClick={skipCVUpload} className={`${greenTextHoverTheme[themeMode]}`}>
                            <p className={`text-xl mt-8 text-center select-none`}>OR</p>
                            <p className={`text-xl text-center select-none`}>Provide skills manually</p>
                        </div>
                    </div>
                )}

                {isCustomFieldsSection && (
                    <CustomFields setCustomFields={setCustomFields} disableSubmitBtn={uploadPDFLoading} />
                )}

                {isExtractedDataSection && (
                    <SkillProficiency profile={profile} setProfile={setProfile} disableSubmitBtn={saveProfileLoading} />
                )}
            </ContentContainer>
        </MainContainer>
    );
};

export default UploadCVPage;