import { apiSlice } from "./apiSlice";


interface SignupSuccessResponse {
    email: string;
    id: number;
};
export interface SignupErrorResponse {
    email?: string[];
    password?: string[];
    re_password?: string[];
    non_field_errors?: string[];
};


export interface VerifyAccountErrorResponse {
    uid?: string[];
    token?: string[];
    detail?: string;
}


interface LoginSuccessResponse {
    access: string;
};
export interface LoginErrorResponse {
    email?: string[]
    password?: string[]
    detail?: string
};


interface LogoutSuccessResponse {
    message: string;
}


export interface UserAccountInfoSuccessResponse {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
}


interface UpdateUserAccountInfoSuccessResponse {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
}


interface GetAccessTokenSuccessResponse {
    access: string;
}
export interface GetAccessTokenErrorResponse {
    message?: string;
    status?: number;
    detail?: string;
    code?: string;
}


export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // implemented
        signup: builder.mutation<SignupSuccessResponse, { email: string; password: string; re_password: string; }>({
            query: (body) => ({
                url: "/api/auth/users/",
                method: "POST",
                body,
            }),
        }),

        // implemented
        verifyAccount: builder.mutation<void, { uid: string; token: string; }>({
            query: (body) => ({
                url: "/api/auth/users/activation/",
                method: "POST",
                body,
            }),
        }),

        // implemented
        login: builder.mutation<LoginSuccessResponse, { email: string; password: string; }>({
            query: (body) => ({
                url: "/api/auth/jwt/create/",
                method: "POST",
                body,
            }),
        }),

        // implemented
        logout: builder.mutation<LogoutSuccessResponse, { accessToken: string }>({
            query: ({ accessToken }) => ({
                url: "/api/logout/",
                method: "POST",
                headers: { Authorization: `JWT ${accessToken}` },
                credentials: "include",
            }),
        }),

        // implemented
        resetPassword: builder.mutation<void, string>({
            query: (email) => ({
                url: "/api/auth/users/reset_password/",
                method: "POST",
                body: { email },
            }),
        }),

        // implemented
        setNewPassword: builder.mutation<void, { uid: string; token: string; password: string; rePassword: string; }>({
            query: ({ uid, token, password, rePassword }) => ({
                url: "/api/auth/users/reset_password_confirm/",
                method: "POST",
                body: { uid, token, new_password: password, re_new_password: rePassword, },
            }),
        }),

        // implemented
        userAccountInfo: builder.query<UserAccountInfoSuccessResponse, string>({
            query: (accessToken) => ({
                url: "/api/auth/users/me/",
                method: "GET",
                headers: {
                    Authorization: `JWT ${accessToken}`,
                },
            }),
            providesTags: ["UserAccount"],
        }),

        updateUserAccountInfo: builder.mutation<UpdateUserAccountInfoSuccessResponse, { name: string; accessToken: string }>({
            query: ({ name, accessToken }) => ({
                url: "/api/auth/users/me/",
                method: "PATCH",
                body: { name },
                headers: { Authorization: `JWT ${accessToken}` },
                credentials: "include",
            }),
        }),

        // implemented
        deleteUserAccount: builder.mutation<void, { password: string, accessToken: string }>({
            query: ({ password, accessToken }) => ({
                url: "/api/auth/users/me/",
                method: "DELETE",
                body: { current_password: password },
                headers: { Authorization: `JWT ${accessToken}` },
                credentials: "include",
            }),
        }),

        // implemented
        getAccessToken: builder.mutation<GetAccessTokenSuccessResponse, void>({
            query: () => ({
                url: "/api/auth/jwt/refresh/",
                method: "POST",
                credentials: "include",
            }),
        }),
    }),
});

export const
    {
        useSignupMutation,
        useVerifyAccountMutation,
        useLoginMutation,
        useLogoutMutation,
        useResetPasswordMutation,
        useSetNewPasswordMutation,
        useLazyUserAccountInfoQuery,
        useUpdateUserAccountInfoMutation,
        useDeleteUserAccountMutation,
        useGetAccessTokenMutation,
    } = usersApiSlice;