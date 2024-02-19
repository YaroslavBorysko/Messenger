import {Fragment, useEffect, useMemo, useRef, useState} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import {XMarkIcon,} from '@heroicons/react/24/outline'
import UserService from '../services/AxiosService';
import {Message} from './Message';
import {TextInput} from './Input'
import {useAuth} from "../context/AuthContext";
import {cn} from "../helpers/cn";
import {useAutosizeTextArea} from "../hooks/useAutosizeTextArea";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export function Dashboard() {
    const {currentUser} = useAuth();

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [messages, setMessages] = useState([])
    const [socket, setSocket] = useState(null);

    const bottomRef = useRef(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({behavior: 'smooth', block: 'end'});
        }
    }, [messages]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await UserService.getAllUsers();
                const data = await response;
                setUsers(data);
                !!data.length && setSelectedUser(data[0]?.id)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUsers();


    }, []);

    useEffect(() => {

        const fetchMessages = async () => {
            try {
                const response = await UserService.getMessages(selectedUser);
                const data = await response;
                console.log(data)
                setMessages(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        !!selectedUser && fetchMessages();
    }, [selectedUser])


    useEffect(() => {
        const socket = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}${currentUser.user_id}/${selectedUser}/`);

        socket.onopen = () => {
            console.log("open");
        };

        socket.onerror = (e) => {
            console.log(`Error socket: ${e}`);
        };

        socket.onmessage = (e) => {
            const parsedData = JSON.parse(e.data);
            if (parsedData.action === 'delete') {

                setMessages((prevMessages) => [
                    ...prevMessages.filter(message => message.id !== parsedData.message_id)
                ])
            } else {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        id: parsedData.message_id,
                        message: parsedData.message,
                        created_on: parsedData.created_on,
                        recipient: parsedData.to_user,
                    },
                ]);
            }
        };

        socket.onclose = () => {
            console.log("closed");
        };

        setSocket(socket);

        return () => {
            if (socket.readyState === 1) {
                socket.close();
            }
        };
    }, [selectedUser]);

    const sendMessage = (message) => {
        socket.send(JSON.stringify({message, to: selectedUser}));
    }
    const deleteMessage = (messageId) => {
        const inMessage = {message_id: messageId, action: "delete"}
        socket.send(JSON.stringify(inMessage));
    }

    const memoMessages = useMemo(() => {
        return !!messages.length && messages.map(message => (
                <Message
                    isFromCurrentUser={message.recipient !== currentUser.user_id}
                    date={message.created_on}
                    message={message.message}
                    key={message.id}
                    handleDelete={deleteMessage}
                    messageId={message.id}
                />

            )
        )
    }, [messages]);

    useAutosizeTextArea()

    return (
        <div>
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className=" inset-0 bg-gray-900/80"/>
                    </Transition.Child>

                    <div className=" inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                        <button type="button" className="-m-2.5 p-2.5"
                                                onClick={() => setSidebarOpen(false)}>
                                            <span className="sr-only">Close sidebar</span>
                                            <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true"/>
                                        </button>
                                    </div>
                                </Transition.Child>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Static sidebar for desktop */}
            <div className="mt-16 hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div
                    className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <div className="mt-4 text-xl font-semibold leading-6 text-gray-400">
                                    Messenger Users
                                </div>
                                <ul role="list" className="-mx-2 mt-2 space-y-1">
                                    {users.map((team) => (
                                        <li key={team.id} onClick={() => setSelectedUser(team.id)}>
                                            <a
                                                href="#"
                                                className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                            >
                          <span
                              className={cn(
                                  team.id === selectedUser
                                      ? 'text-indigo-600 border-indigo-600'
                                      : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
                                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                              )}
                          >
                            {team.username[0].toUpperCase()}
                          </span>
                                                <span className="truncate">{team.username}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <div className="lg:pl-72" ref={bottomRef}>
                <main className="py-10">
                    <div
                        className="flex flex-col items-baseline sm:w-[100%] lg:w-[calc(100vw-18rem)] px-4 sm:px-4 lg:px-1 my-32">
                        {memoMessages}
                    </div>
                    <div
                        className="bottom-0 fixed w-[100%] lg:w-[calc(100vw-18rem)] px-2 pb-2">
                        <TextInput handleSocketSubmit={sendMessage}/>
                    </div>
                </main>
            </div>
        </div>
    )
}
