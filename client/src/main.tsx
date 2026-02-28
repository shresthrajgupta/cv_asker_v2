// typscript applied
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './redux/store';

import './index.css';

import App from './App';

import PrivateRoute from './components/PrivateRoute';

import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';
import AccountActivatedPage from './pages/AccountActivatedPage';
// import NotFoundPage from './pages/NotFoundPage.jsx';
import HomePage from './pages/HomePage';
// import UploadCVPage from './pages/UploadCVPage.jsx';
// import AccountPage from './pages/AccountPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
// import DeleteAccountPage from './pages/DeleteAccountPage.jsx';
// import ProfilePage from './pages/ProfilePage.jsx';
// import PracticePage from './pages/PracticePage.jsx';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route index={true} path='/' element={<LoginPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignUpPage />} />
            <Route path='/activate/:uid/:token' element={<AccountActivatedPage />} />
            <Route path='/password-reset/*' element={<ForgotPasswordPage />} />

            <Route path='' element={<PrivateRoute />}>
                <Route path='/home' element={<HomePage />}></Route>
                {/* <Route path='/upload' element={<UploadCVPage />} /> */}
                {/* <Route path='/account' element={<AccountPage />} /> */}
                {/* <Route path='/profile' element={<ProfilePage />} /> */}
                {/* <Route path='/delete' element={<DeleteAccountPage />} /> */}
                {/* <Route path='/practice' element={<PracticePage />} /> */}
            </Route>

            {/* <Route path='*' element={<NotFoundPage />} /> */}
        </Route>
    )
);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </StrictMode>,
);
