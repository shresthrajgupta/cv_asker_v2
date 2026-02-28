import { useEffect, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "../hooks/hooks";

import { useGetAccessTokenMutation, useLazyUserAccountInfoQuery } from "../redux/slices/async/usersApiSlice";

import { setAccessToken } from '../redux/slices/sync/accessTokenSlice';
import { setCredentials } from '../redux/slices/sync/authSlice';

import Loading from "./Loading";


const PrivateRoute = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { accessToken } = useAppSelector((state) => state.accessToken);
    const { userInfo } = useAppSelector((state) => state.auth);

    const [getAccessToken, { isLoading: getAccessTokenLoading }] = useGetAccessTokenMutation();
    const [userAccount, { isFetching: userAccountInfoFetching }] = useLazyUserAccountInfoQuery();

    const loginAgain = useCallback(async () => {
        console.log("5 min countdown started");

        try {
            const accessTokenResponse = await getAccessToken().unwrap();
            dispatch(setAccessToken(accessTokenResponse.access));

            const userAccountInfo = await userAccount(accessTokenResponse.access).unwrap();
            dispatch(setCredentials(userAccountInfo));
        } catch (err) {
            console.error(err);
            navigate("/login");
        }
    }, [dispatch, getAccessToken, userAccount, navigate]);

    useEffect(() => {
        if (!accessToken || accessToken === "" || !userInfo) {
            loginAgain();
        }

        if (!userAccountInfoFetching && userInfo && !userInfo?.is_active) {
            navigate("/login");
        }

        // run loginAgain function every 5 minutes
        const interval: ReturnType<typeof setInterval> = setInterval(loginAgain, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [loginAgain]);

    if ((!accessToken || !userInfo) && (getAccessTokenLoading || userAccountInfoFetching)) {
        return <Loading />;
    }

    return <Outlet />;
};

export default PrivateRoute;