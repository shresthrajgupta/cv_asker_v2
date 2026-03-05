import { apiSlice } from './apiSlice';

interface CustomField {
    [key: string]: string;
}

interface UploadPDFRequest {
    file: File;
    custom_fields: CustomField[];
    accessToken: string;
};

export interface UploadPDFSuccessResponseData {
    "Experience Level": number;
    "Skills": string[];
}

interface UploadPDFSuccessResponse {
    "data": UploadPDFSuccessResponseData;
};

export interface UploadPDFErrorResponse {
    detail?: string;
    file?: string[];
    custom_fields?: string[];
};


export const cvApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        uploadPDF: builder.mutation<UploadPDFSuccessResponse, UploadPDFRequest>({
            query: ({ file, custom_fields, accessToken }) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("custom_fields", JSON.stringify(custom_fields));

                return {
                    url: "/api/upload/",
                    method: 'POST',
                    headers: { authorization: `JWT ${accessToken}` },
                    body: formData,
                    credentials: "include" as const
                }
            }
        }),
    })
});

export const
    {
        useUploadPDFMutation,
    } = cvApiSlice;