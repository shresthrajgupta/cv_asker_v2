import { apiSlice } from "./apiSlice";

export interface userAccountInfoInterface {
    id: number;
    name: string;
    email: string;
    is_active: boolean
}

// ================= REQUEST TYPES =================

interface SignupRequest {
    email: string;
    password: string;
    re_password: string;
}

interface VerifyAccountRequest {
    uid: string;
    token: string;
}

interface SetNewPasswordRequest {
    uid: string;
    token: string;
    password: string;
    rePassword: string;
}

interface UpdateUserRequest {
    name: string;
    accessToken: string;
}

interface DeleteUserRequest {
    password: string;
    accessToken: string;
}


export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        signup: builder.mutation<void, SignupRequest>({
            query: (body) => ({
                url: "/api/auth/users/",
                method: "POST",
                body,
            }),
        }),

        verifyAccount: builder.mutation<void, VerifyAccountRequest>({
            query: (body) => ({
                url: "/api/auth/users/activation/",
                method: "POST",
                body,
            }),
        }),

        login: builder.mutation<{ access: string; }, { email: string; password: string; }>({
            query: (body) => ({
                url: "/api/auth/jwt/create/",
                method: "POST",
                body,
            }),
        }),

        logout: builder.mutation<void, string>({
            query: (accessToken) => ({
                url: "/api/logout/",
                method: "POST",
                headers: { Authorization: `JWT ${accessToken}` },
                credentials: "include",
            }),
        }),

        resetPassword: builder.mutation<void, string>({
            query: (email) => ({
                url: "/api/auth/users/reset_password/",
                method: "POST",
                body: { email },
            }),
        }),

        setNewPassword: builder.mutation<void, SetNewPasswordRequest>({
            query: ({ uid, token, password, rePassword }) => ({
                url: "/api/auth/users/reset_password_confirm/",
                method: "POST",
                body: {
                    uid,
                    token,
                    new_password: password,
                    re_new_password: rePassword,
                },
            }),
        }),

        userAccountInfo: builder.query<userAccountInfoInterface, string>({
            query: (accessToken) => ({
                url: "/api/auth/users/me/",
                method: "GET",
                headers: {
                    Authorization: `JWT ${accessToken}`,
                },
            }),
            providesTags: ["UserAccount"],
        }),

        updateUserAccountInfo: builder.mutation<void, UpdateUserRequest>({
            query: ({ name, accessToken }) => ({
                url: "/api/auth/users/me/",
                method: "PATCH",
                body: { name },
                headers: { Authorization: `JWT ${accessToken}` },
                credentials: "include",
            }),
        }),

        deleteUserAccount: builder.mutation<void, DeleteUserRequest>({
            query: ({ password, accessToken }) => ({
                url: "/api/auth/users/me/",
                method: "DELETE",
                body: { current_password: password },
                headers: { Authorization: `JWT ${accessToken}` },
                credentials: "include",
            }),
        }),

        getAccessToken: builder.mutation<{ access: string }, void>({
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