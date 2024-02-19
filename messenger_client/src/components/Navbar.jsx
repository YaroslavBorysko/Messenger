import {useEffect, useState} from 'react'
import {Disclosure} from '@headlessui/react'
import {useAuth} from '../context/AuthContext';
import {Link} from 'react-router-dom';
import PngImage from '../imp/messeger-icon.png'


export function Navbar() {

    const {currentUser, logOut, isLogin} = useAuth();

    const [navigation, setNavigation] = useState([])

    useEffect(() => {
        setNavigation(
            isLogin
                ? [{name: currentUser.username, href: '#'}]
                : [
                    {name: 'Sign Up', href: 'registration'},
                    {name: 'Login', href: 'login'},
                ])
    }, [isLogin])


    return (
        <Disclosure as="nav" className="bg-gray-800 fixed top-0 w-full">
            <div className="mx-auto max-w-9xl px-1 sm:px-4 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex flex-shrink-0 items-center">
                        <img
                            className="h-8 w-auto"
                            src={PngImage}
                            alt="Your Company"
                        />
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-end">
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className='bg-gray-800 text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-900'
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                {isLogin &&
                                    <button
                                        className='bg-gray-800 text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-900'
                                        onClick={logOut}
                                    >
                                        Log Out
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Disclosure>
    )
}
