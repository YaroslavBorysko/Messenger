import {useEffect} from 'react';

export const useAutosizeTextArea = (textAreaRef, value) => {
    useEffect(() => {
        if (textAreaRef) {
            textAreaRef.style.height = '0px';
            textAreaRef.style.maxHeight = '200px';
            const scrollHeight = textAreaRef.scrollHeight + 2;

            textAreaRef.style.height = scrollHeight + 'px';
        }
    }, [textAreaRef, value]);
};

