import React from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate, Outlet} from 'react-router-dom';
import {Navbar} from './components/Navbar';
import {Login} from './components/Login';
import {Register} from './components/Registration';
import {Dashboard} from './components/Dashboard';
import { AuthProvider } from './context/AuthContext';
import {useAuth} from "./context/AuthContext";


const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isLogin } = useAuth();

    return isLogin ? <Dashboard /> : <Navigate to="/login" />
};

const App = () => {
    return (
        <AuthProvider>
        <Router>
            <nav>
                <Navbar/>
            </nav>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/registration" element={<Register/>}/>
                <Route path="/" element={<PrivateRoute/>}/>
            </Routes>
        </Router>
        </AuthProvider>
    );
};

export default App;