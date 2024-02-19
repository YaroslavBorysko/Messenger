import {useRef, useState} from 'react'
import {useAutosizeTextArea} from "../hooks/useAutosizeTextArea";

export function TextInput({handleSocketSubmit}) {
    const ref = useRef(null);
    const [inputText, setInputText] = useState('')

    const handleMessageCreate = (e) => {
        e.preventDefault()
        handleSocketSubmit(inputText)
        setInputText('')
    }

    useAutosizeTextArea(ref.current, inputText)

    return (
        <div className="flex items-start bg-white">
            <div className="min-w-0 flex-1">
                <form action="#" className="relative">
                    <div
                        className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 relative">
                        <label htmlFor="comment" className="sr-only">
                            Add your comment
                        </label>
                        <textarea
                            ref={ref}
                            rows={3}
                            name="comment"
                            onChange={(e) => {
                                setInputText(e.target.value)
                            }}
                            value={inputText}
                            id="comment"
                            className="block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 p-5"
                            placeholder="Add your comment..."
                        />

                         {/*Spacer element to match the height of the toolbar */}
                        <div className="py-2" aria-hidden="true">
                            {/* Matches height of button in toolbar (1px border + 36px content height) */}
                            <div className="py-px">
                                <div className="h-9"/>
                            </div>
                        </div>
                    </div>

                    <div className="absolute  bottom-2 right-2 w-fit">
                        <button
                            type="submit"
                            onClick={handleMessageCreate}
                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
