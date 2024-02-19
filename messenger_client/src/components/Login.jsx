import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../services/AxiosService';
import { useState } from 'react';
import PngImage from '../imp/messeger-icon.png'
import {Alert} from "./Alert";

export function Login() {

    const navigate = useNavigate();
    const { logIn } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleUserLogin = async (e) => {
        e.preventDefault()
        if (!username || !password){
            setError("Fill the fields to login")
            return
        }
        const data = {
            username: username,
            password: password
        };
        try {
            const response = await UserService.loginUser(data);
            await logIn(response.access);
            navigate('/');
        } catch (data) {
            setError(Object.values(e.response.data))
        }
    };

    return (
        <div className="flex min-h-[800px] flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            {!!error && <Alert detail={error}/> }
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-10 w-auto"
                    src={PngImage}
                    alt="Your Company"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                           Username
                        </label>
                        <div className="mt-2">
                            <input
                                id="username"
                                name="username"
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={handleUserLogin}
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Not a member?{' '}
                    <Link to="/registration" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Create a new profile
                    </Link>
                </p>
            </div>
        </div>
    )
}
