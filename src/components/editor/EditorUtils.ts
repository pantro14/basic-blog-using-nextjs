import {Editor} from '@tiptap/react';

export const gefFocusEditor = (editor: Editor | null) => {
    return editor?.chain().focus();
}

export const validateUrl = (url: string) => {
    if (!url.trim()) return '';
    let finalUrl;
    try {
        finalUrl = new URL(url);
    } catch (error) {
        finalUrl = new URL('https://' + url)
    }
    return finalUrl.origin;
}
