import { apiSlice } from './apiSlice';

export interface Skill {
    name: string;
    proficiency: number;
}

export interface Profile {
    skills: Skill[];
    job_profile: string;
    experience_years: number;
}

interface SaveProfileRequest {
    profile: Profile;
    accessToken: string;
};

interface SaveProfileSuccessResponse {
    message: string;
    id: number;
};

export interface SaveProfileErrorResponse {
    detail: string;
    skills?: { name?: string[]; proficiency?: string[] }[];
    job_profile?: string[];
    experience_years: string[];
};

interface PatchProfileRequest {
    profile: Profile;
    accessToken: string;
}

interface PatchProfileSuccessResponse {
    "message": "Profile updated"
}

interface PatchProficiencyRequest {
    payload: { skill: string; action: "increase" | "decrease" };
    accessToken: string
}
interface PatchProficiencySuccessResponse {
    data: { message: string };
}


export const profileApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        saveProfile: builder.mutation<SaveProfileSuccessResponse, SaveProfileRequest>({
            query: ({ profile, accessToken }) => {
                return {
                    url: "/api/profile/",
                    method: 'POST',
                    headers: { authorization: `JWT ${accessToken}` },
                    body: profile,
                    credentials: "include"
                }
            }
        }),

        getProfile: builder.query<Profile, string>({
            query: (accessToken) => ({
                url: "/api/profile/",
                method: 'GET',
                headers: {
                    Authorization: `JWT ${accessToken}`,
                }
            }),
            providesTags: ["UserProfile"]
        }),

        patchProfile: builder.mutation<PatchProfileSuccessResponse, PatchProfileRequest>({
            query: ({ profile, accessToken }) => {
                return {
                    url: "/api/profile/",
                    method: 'PATCH',
                    headers: { authorization: `JWT ${accessToken}` },
                    body: profile,
                    credentials: "include"
                }
            }
        }),

        patchProficiency: builder.mutation<PatchProficiencySuccessResponse, PatchProficiencyRequest>({
            query: ({ payload, accessToken }) => {

                return {
                    url: "/api/profile/proficiency",
                    method: 'PATCH',
                    headers: { Authorization: `JWT ${accessToken}` },
                    body: payload,
                    credentials: "include"
                }
            }
        }),
    }),
});

export const
    {
        useSaveProfileMutation,
        useLazyGetProfileQuery,
        usePatchProfileMutation,
        usePatchProficiencyMutation,
    } = profileApiSlice;