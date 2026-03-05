import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

import { useAppSelector } from "../hooks/hooks.js";

import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import GreenButton from "../components/GreenButton";
import MainContainer from "../components/MainContainer.jsx";
import Overlay from "../components/Overlay.jsx";
import ContentContainer from "../components/ContentContainer.jsx";

import { useLazyGetProfileQuery, usePatchProficiencyMutation } from "../redux/slices/async/profileApiSlice";
import { useGetQuestionsMutation, useStoreQuestionsMutation } from "../redux/slices/async/questionApiSlice";
import { useStoreQuestionHistoryMutation } from "../redux/slices/async/userHistorySlice";

import { contentBackgroundColor, toastBackgroundTheme, toastTextTheme } from "../utils/themeUtil";

import { type Skill } from "../redux/slices/async/profileApiSlice";
import { type Question } from "../redux/slices/async/questionApiSlice";

interface SkillToAsk {
    skill: string;
    proficiency: number;
}

const PracticePage = () => {
    const [skills, setSkills] = useState<Skill[] | null>(null);
    const [skillToAsk, setSkillToAsk] = useState<SkillToAsk | null>(null);
    const [isQuestionsSection, setIsQuestionsSection] = useState<boolean>(false);
    const [questionArray, setQuestionArray] = useState<Question[] | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [currentOptionSelected, setCurrentOptionSelected] = useState<string>("");
    const [isOptionChecked, setIsOptionChecked] = useState<boolean>(false);
    const [ifFinalDialogue, setIsFinalDialogue] = useState<boolean>(false);

    const totalScore = useRef(0);

    const { accessToken } = useAppSelector((state) => state.accessToken);
    const { themeMode } = useAppSelector((state) => state.theme);

    const [getProfile, { isLoading: getProfileLoading }] = useLazyGetProfileQuery();
    const [getQuestions, { isLoading: getQuestionsLoading }] = useGetQuestionsMutation();
    const [storeQuestions] = useStoreQuestionsMutation();
    const [patchProficiency, { isLoading: patchProficiencyLoading }] = usePatchProficiencyMutation();
    const [storeQuestionHistory] = useStoreQuestionHistoryMutation();

    const checkQuestion = (option: string) => {
        if (!isOptionChecked) {
            setCurrentOptionSelected(option);
        }
        setIsOptionChecked(true);
    };

    const nextQuestion = async () => {
        if (!accessToken) {
            toast.error("Invalid credentials",
                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
            return;
        }

        if (!questionArray) {
            toast.error("Question array is null",
                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
            return;
        }

        if (currentQuestion < questionArray.length - 1) {
            if (questionArray[currentQuestion].correct_ans.toLowerCase() === currentOptionSelected) {
                totalScore.current += 1;
                storeQuestionHistory({ payload: { question_id: questionArray[currentQuestion].id, answered_correctly: true }, accessToken });
            }
            else {
                storeQuestionHistory({ payload: { question_id: questionArray[currentQuestion].id, answered_correctly: false }, accessToken });
            }

            setCurrentQuestion(currentQuestion + 1);
            setIsOptionChecked(false);
        }
        else {
            console.log("error in nextQuestion function");
        }
    };
    const finishQuestion = async () => {
        if (!questionArray) {
            toast.error("Question array is null",
                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
            return;
        }

        if (!skillToAsk) {
            toast.error("No skill to be asked selected",
                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
            return;
        }

        if (!accessToken) {
            toast.error("Invalid credentials",
                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
            return;
        }

        if (currentQuestion === questionArray.length - 1) {
            try {
                if (questionArray[currentQuestion].correct_ans.toLowerCase() === currentOptionSelected) {
                    totalScore.current += 1;
                    storeQuestionHistory({ payload: { question_id: questionArray[currentQuestion].id, answered_correctly: true }, accessToken });
                }
                else {
                    storeQuestionHistory({ payload: { question_id: questionArray[currentQuestion].id, answered_correctly: false }, accessToken });
                }

                if (totalScore.current >= 9 && skillToAsk.proficiency < 10) {
                    await patchProficiency({ payload: { skill: skillToAsk.skill, action: "increase" }, accessToken }).unwrap();
                }
                else if (totalScore.current <= 5 && skillToAsk.proficiency > 0) {
                    await patchProficiency({ payload: { skill: skillToAsk.skill, action: "decrease" }, accessToken }).unwrap();
                }

                setIsFinalDialogue(true);
            } catch (err) {
                console.log(err);
            }
        }
        else {
            console.log("error in nextQuestion function");
        }
    };

    const handleSetRandomSkill = () => {
        if (!skills) {
            toast.error("No skill selected",
                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
            return;
        }
        const randomNumber = Math.floor(Math.random() * skills.length);
        setSkillToAsk({ skill: skills[randomNumber].name, proficiency: skills[randomNumber].proficiency });
    };

    const fetchQuestions = async () => {
        if (!skillToAsk) {
            toast.error("No skill to be asked selected",
                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
            return;
        }

        if (!accessToken) {
            toast.error("Invalid credentials",
                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
            return;
        }

        if (skillToAsk.skill && skillToAsk.proficiency) {
            try {
                setIsQuestionsSection(true);
                const res = await getQuestions({ skillToAsk, accessToken }).unwrap();

                if (res.data) {
                    setQuestionArray(res.data);
                }
                else {
                    setIsQuestionsSection(false);
                    toast.error("Error generating questions", { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
                }

                if (skillToAsk.proficiency < 10) {
                    storeQuestions({ skillToAsk: { skill: skillToAsk.skill, proficiency: skillToAsk.proficiency + 1 }, accessToken }).unwrap();
                }
                if (skillToAsk.proficiency > 1) {
                    storeQuestions({ skillToAsk: { skill: skillToAsk.skill, proficiency: skillToAsk.proficiency - 1 }, accessToken }).unwrap();
                }
            } catch (err) {
                setIsQuestionsSection(false);
                console.log(err);
            }
        }
    };

    const restartSameQuestionTopic = () => {
        fetchQuestions();

        setCurrentQuestion(0);
        setCurrentOptionSelected("");
        setIsOptionChecked(false);
        setIsFinalDialogue(false);
    };

    const goBackToSkillList = () => {
        setSkillToAsk(null);
        setIsQuestionsSection(false);
        setQuestionArray([]);
        setCurrentQuestion(0);
        setCurrentOptionSelected("");
        setIsOptionChecked(false);
        setIsFinalDialogue(false);
    };

    useEffect(() => {
        if (!skillToAsk) {
            toast.error("No skill to be asked selected",
                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
            return;
        }

        if (skillToAsk.skill?.length > 0 && skillToAsk.proficiency > 0) {
            fetchQuestions();
        }
    }, [skillToAsk]);

    useEffect(() => {
        const fetchData = async () => {
            if (!accessToken) {
                toast.error("Invalid credentials",
                    { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
                return;
            }

            try {
                const res = await getProfile(accessToken).unwrap();
                setSkills(res.skills);
            } catch (err) {
                toast.error("Error fetching data, Please try again later",
                    { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
                console.log(err);
            }

        };
        fetchData();
    }, []);


    return (
        <MainContainer>
            <Sidebar />

            <Overlay />

            <ContentContainer>
                {
                    !ifFinalDialogue && !isQuestionsSection && (
                        getProfileLoading ?
                            <Loading size={70} />
                            :

                            <>
                                <div className="w-full min-h-full">
                                    <h2 className="text-3xl mb-6 text-center select-none">What do you want to practice?</h2>

                                    <div className={`w-full flex justify-center items-center`}>
                                        <GreenButton type="button" text="Choose Randomly" onclick={handleSetRandomSkill} />
                                    </div>

                                    <div className="w-[95%] mx-auto py-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {skills?.map((item, index) => (
                                            <div key={index} onClick={() => setSkillToAsk({ skill: item.name, proficiency: item.proficiency })} className={`p-4 rounded-xl shadow-md hover:shadow-lg transition ${contentBackgroundColor[themeMode]}`}>
                                                <h2 className="font-semibold text-lg cursor-default">{item.name}</h2>
                                                <p className="mt-1 text-sm cursor-default">Proficiency: {item.proficiency}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                    )
                }

                {
                    !ifFinalDialogue && isQuestionsSection && (
                        getQuestionsLoading ?
                            <div className="mt-16">
                                <Loading size={70} />
                            </div>
                            :
                            <>
                                <div className="w-full flex justify-end items-center mt-6 pr-[7%] lg:pr-20">
                                    <GreenButton type="button" text="Exit Questions" onclick={goBackToSkillList} />
                                </div>

                                <div className="max-w-[95%] lg:w-[45%] mx-auto p-6">
                                    <div className={`p-6 rounded-xl shadow-md ${contentBackgroundColor[themeMode]}`}>
                                        {questionArray && (<h2 className="text-lg font-semibold mb-4 select-none">
                                            Q{currentQuestion + 1}. {questionArray[currentQuestion].question}
                                        </h2>)}

                                        {questionArray && (<div className="space-y-2">
                                            {[questionArray[currentQuestion].option_a, questionArray[currentQuestion].option_b, questionArray[currentQuestion].option_c, questionArray[currentQuestion].option_d].map((opt, i) => (
                                                <div key={i} onClick={() => { checkQuestion(String.fromCharCode('a'.charCodeAt(0) + i)) }} className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition select-none ${isOptionChecked && ((questionArray[currentQuestion].correct_ans.toLowerCase() === String.fromCharCode('a'.charCodeAt(0) + i)) ? "border-green-500" : "border-red-500")}`}>
                                                    <strong className="shrink-0 h-full">{String.fromCharCode('a'.charCodeAt(0) + i)}. &nbsp; </strong>
                                                    <p className="flex-1"> {opt} </p>
                                                </div>
                                            ))}
                                        </div>)}
                                    </div>

                                    <div className="flex justify-between mt-6">
                                        {
                                            questionArray && (currentQuestion !== questionArray.length - 1) &&
                                            <GreenButton type="button" text="Next" onclick={nextQuestion} disabled={!isOptionChecked} additionalClasses="px-4" />
                                        }

                                        {
                                            questionArray && (currentQuestion === questionArray.length - 1) &&
                                            <GreenButton type="button" text="Finish" onclick={finishQuestion} disabled={!isOptionChecked} additionalClasses="px-4" />
                                        }

                                    </div>
                                </div>
                            </>
                    )
                }

                {
                    ifFinalDialogue && (
                        patchProficiencyLoading ? <Loading size={70} /> :
                            <>
                                <div className={`max-w-md mx-auto mt-10 p-6 rounded-xl shadow-lg text-center ${contentBackgroundColor[themeMode]}`}>
                                    <h2 className="text-2xl font-bold  mb-4">
                                        Your score is{" "}
                                        <span className="text-indigo-600">
                                            {totalScore.current}
                                        </span>
                                    </h2>

                                    <p className=" mb-6">Do you want to practice more?</p>

                                    <div className="flex justify-center gap-4">
                                        <GreenButton type="button" text="Yes" onclick={restartSameQuestionTopic} additionalClasses="px-6" />

                                        <GreenButton type="button" text="Go back" onclick={goBackToSkillList} additionalClasses="bg-gray-600 hover:bg-gray-700 px-3" />
                                    </div>
                                </div>
                            </>
                    )
                }
            </ContentContainer>
        </MainContainer >
    );
};

export default PracticePage;