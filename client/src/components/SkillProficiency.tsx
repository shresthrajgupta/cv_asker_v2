import { useEffect, useState } from "react";
import { Plus, Trash } from "lucide-react";
import { toast } from "react-toastify";

import { useAppSelector } from "../hooks/hooks";

import GreenButton from "./GreenButton";
import Loading from "./Loading";

import { textColorTheme, textInputBackgroundColorTheme, contentBackgroundColor, toastBackgroundTheme, toastTextTheme, headingColorTheme, sectionTitleTheme } from "../utils/themeUtil";

import { type ProfileInterface } from "../pages/UploadCVPage";

type Skill = { name: string; proficiency: string; };

interface SkillProficiencyProps {
    profile: ProfileInterface | null;
    setProfile: (profile: any) => void;
    disableSubmitBtn: boolean;
    isGetProfilePage?: boolean;
    setButtonClicked?: (clicked: boolean) => void;
};


const SkillProficiency = ({ profile, setProfile, disableSubmitBtn, isGetProfilePage = false, setButtonClicked }: SkillProficiencyProps) => {
    const [experienceYears, setExperienceYears] = useState<number>(0);
    const [jobProfile, setJobProfile] = useState<string>("");
    const [skills, setSkills] = useState<Skill[]>([{ name: "", proficiency: "1" }]);

    const { themeMode } = useAppSelector((state) => state.theme);

    const handleChange = (index: number, field: keyof Skill, newValue: string) => {
        const updatedSkills = [...skills];
        updatedSkills[index][field] = newValue;
        setSkills(updatedSkills);
    };

    const addSkill = (skill: string = "") => {
        const lastSkill = skills[skills.length - 1];

        if (lastSkill.name !== "" && lastSkill.proficiency !== "") {
            setSkills(prev => [...prev, { name: skill, proficiency: "1" }]);
        }
    };

    const removeSkill = (index: number) => {
        const updatedSkills = skills.filter((_, i) => i !== index);
        setSkills(updatedSkills.length > 0 ? updatedSkills : [{ name: "", proficiency: "" }]);
    };

    const handleSubmit = () => {
        let isError = false;

        skills.forEach((skill) => {
            if (skill.name === "") {
                toast.error("Please enter skill name",
                    { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                );
                isError = true;
                return;
            }
            if (skill.proficiency === "") {
                toast.error("Please enter proficiency",
                    { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                );
                isError = true;
                return;
            }
            if (Number(skill.proficiency) < 1) {
                toast.error("Invalid proficiency",
                    { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                );
                isError = true;
                return;
            }
            if (Number(skill.proficiency) > 10) {
                toast.error("Invalid proficiency",
                    { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                );
                isError = true;
                return;
            }
        });

        if (isError) {
            return;
        }

        const payload = {
            skills: skills.filter((s) => s.name.trim() && s.proficiency !== "").map((s) => ({
                name: s.name,
                proficiency: Number(s.proficiency),
            })),
            job_profile: jobProfile,
            experience_years: Number(experienceYears),
        };

        setProfile({ ...payload });
        if (setButtonClicked) {
            setButtonClicked(true);
        }
    };

    useEffect(() => {
        if (isGetProfilePage && profile && profile.skills && profile.skills.length > 0) {
            if (!profile.job_profile) {
                toast.error("Job profile not present",
                    { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                );
                return;
            }
            setJobProfile(profile.job_profile);
            setExperienceYears(Number(profile.experience_years));

            setSkills([]);
            profile.skills.forEach(skill => {
                const { name, proficiency } = skill;
                if (!proficiency) {
                    return;
                }
                setSkills(prev => [...prev, { name, proficiency: String(proficiency) }]);
            });
        }
        else if (profile && profile.skills && profile.skills.length > 0) {
            setExperienceYears(Number(profile.experience_years));

            setSkills([]);
            profile.skills.forEach(skill => {
                setSkills(prev => [...prev, { name: skill.name, proficiency: "" }]);
            });
        }
        else {
            // toast.error("Job profile not present",
            //     { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
            // );
            return;
        }
    }, [profile]);

    return (
        <div className={`p-6 ${contentBackgroundColor[themeMode]} rounded-xl md:w-4/5 lg:w-3/5 space-y-4`}>
            <h2 className={`py-3 text-2xl text-center select-none ${headingColorTheme[themeMode]}`}>Are these information accurate?</h2>

            <div className="flex gap-2 w-full">
                <div className="w-2/5 flex items-center min-w-30 select-none">Job Profile</div>
                <input type="text" disabled={disableSubmitBtn} placeholder="Ex: Lawyer" value={jobProfile} onChange={(e) => setJobProfile(e.target.value)} className={`w-1/2 p-2 rounded focus:outline-none border-none ${textInputBackgroundColorTheme[themeMode]} ${disableSubmitBtn && "cursor-not-allowed"}`} />
            </div>

            <div className="flex gap-2 w-full">
                <div className="w-2/5 flex items-center min-w-30 select-none">Experience (Years)</div>
                <input type="number" disabled={disableSubmitBtn} placeholder="Enter Experience (in Years)" value={experienceYears} min={0} max={50} onChange={(e) => setExperienceYears(Number(e.target.value))} className={`w-1/2 p-2 rounded focus:outline-none border-none ${textInputBackgroundColorTheme[themeMode]} ${disableSubmitBtn && "cursor-not-allowed"}`} />
            </div>

            <h2 className={`my-3 text-lg font-semibold select-none ${sectionTitleTheme[themeMode]}`}>Skills</h2>

            {skills.map((skill, index) => (
                <div key={index} className="flex gap-2 w-full">
                    <input type="text" disabled={disableSubmitBtn} placeholder="Skill name" value={skill.name} onChange={(e) => handleChange(index, "name", e.target.value)} className={`w-3/5 min-w-30 p-2 rounded focus:outline-none border-none ${textInputBackgroundColorTheme[themeMode]} ${disableSubmitBtn && "cursor-not-allowed"}`} />

                    <input type="number" disabled={disableSubmitBtn} placeholder="Proficiency (1-10)" value={skill.proficiency} min={1} max={10} onChange={(e) => handleChange(index, "proficiency", e.target.value)} className={`w-1/4 p-2 rounded focus:outline-none border-none ${textInputBackgroundColorTheme[themeMode]} ${disableSubmitBtn && "cursor-not-allowed"}`} />

                    <button type="button" onClick={() => removeSkill(index)} className={`pl-2 py-2 text-red-500 ${!disableSubmitBtn && "hover:text-red-700"} flex justify-end w-auto`} >
                        <Trash size={22} />
                    </button>
                </div>
            ))}

            <button type="button" disabled={disableSubmitBtn} onClick={() => addSkill()} className={`flex items-center gap-2 ${textColorTheme[themeMode]} ${!disableSubmitBtn && "hover:underline"} select-none`} >
                <Plus size={18} /> Add Skill
            </button>

            <GreenButton text={disableSubmitBtn ? <Loading /> : (isGetProfilePage ? "Update" : "Submit")} type="button" disabled={disableSubmitBtn} onclick={handleSubmit} additionalClasses="px-4" />
        </div >
    );
};

export default SkillProficiency;
