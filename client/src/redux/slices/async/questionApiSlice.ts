import { apiSlice } from './apiSlice';

export interface Question {
    id: number;
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_ans: string;
    difficulty: number;
}

interface GetQuestionsRequest {
    skillToAsk: {
        skill: String;
        proficiency: Number;
    }
    accessToken: string;
};

interface GetQuestionsSuccessResponse {
    data: Question[];
}

interface StoreQuestionsRequest extends GetQuestionsRequest { }

interface StoreQuestionsSuccessResponse {
    data: { message: string; }
}


export const questionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getQuestions: builder.mutation<GetQuestionsSuccessResponse, GetQuestionsRequest>({
            query: ({ skillToAsk, accessToken }) => {
                return {
                    url: "/api/question/fetch",
                    method: 'POST',
                    headers: { authorization: `JWT ${accessToken}` },
                    body: skillToAsk,
                    credentials: "include"
                }
            }
        }),

        storeQuestions: builder.mutation<StoreQuestionsSuccessResponse, StoreQuestionsRequest>({
            query: ({ skillToAsk, accessToken }) => {
                return {
                    url: "/api/question/store",
                    method: 'POST',
                    headers: { authorization: `JWT ${accessToken}` },
                    body: skillToAsk,
                    credentials: "include"
                }
            }
        }),
    })
});

export const
    {
        useGetQuestionsMutation,
        useStoreQuestionsMutation,
    } = questionApiSlice;