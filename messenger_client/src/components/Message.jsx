import {formatDate} from "../helpers/formatDate";
import {Menu, Transition} from "@headlessui/react";
import {EllipsisVerticalIcon, TrashIcon} from "@heroicons/react/20/solid";
import {Fragment} from "react";

const staticClasses = 'rounded-md px-4 py-5 sm:px-6 max-w-3xl my-1 flex min-w-[70%]'
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export function Message({message, date, isFromCurrentUser, messageId, handleDelete}) {

    const messageContainerClasses = isFromCurrentUser ? `${staticClasses} ml-auto bg-orange-100` : `${staticClasses} bg-green-100 `;

    return (<div className={messageContainerClasses}>
            <div className="min-w-0 flex-1">
                <p className="text-xl text-gray-800">
                    {message}
                </p>
                <p className="text-sm text-gray-500">
                    {formatDate(date)}
                </p>
            </div>
            <div className="flex flex-shrink-0 self-center">
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button
                            className="-m-2 flex items-center rounded-full p-2 text-gray-400 hover:text-gray-600">
                            <span className="sr-only">Open options</span>
                            <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true"/>
                        </Menu.Button>
                    </div>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items
                            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                                <Menu.Item>
                                    {({active}) => (<a
                                            onClick={() => {
                                                handleDelete(messageId)
                                            }}
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'flex px-4 py-2 text-sm'
                                            )}
                                        >
                                            <TrashIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true"/>
                                            <span>Delete</span>
                                        </a>)}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </div>);
}
