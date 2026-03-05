import { apiSlice } from './apiSlice';

interface StoreQuestionHistoryRequest {
    payload: { question_id: number; answered_correctly: boolean; }
    accessToken: string;
}

interface StoreQuestionHistorySuccessResponse {
    data: { message: string; }
}


export const userHistorySlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        storeQuestionHistory: builder.mutation<StoreQuestionHistorySuccessResponse, StoreQuestionHistoryRequest>({
            query: ({ payload, accessToken }) => {
                return {
                    url: "/api/history/update",
                    method: 'POST',
                    headers: { authorization: `JWT ${accessToken}` },
                    body: payload,
                    credentials: "include"
                }
            }
        }),
    })
});

export const
    {
        useStoreQuestionHistoryMutation,
    } = userHistorySlice;