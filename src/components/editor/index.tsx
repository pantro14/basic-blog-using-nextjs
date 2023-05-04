import {FC, useEffect, useState} from 'react';
import {EditorContent, useEditor, getMarkRange, Range} from '@tiptap/react';
import {StarterKit} from '@tiptap/starter-kit';
import ToolBar from './ToolBar';
import {Underline} from '@tiptap/extension-underline';
import {Placeholder} from '@tiptap/extension-placeholder';
import {Link} from '@tiptap/extension-link';
import { EditLink } from './Link/EditLink';
import Youtube from '@tiptap/extension-youtube';
import GalleryModal, {ImageSelectionResult} from '../editor/GalleryModal';
import TipTapImage from '@tiptap/extension-image';

interface Props {

}

const Editor: FC<Props> = (props): JSX.Element => {
    const [showGallery, setShowGallery] = useState(false);
    const [selectionRange, setSelectionRange] = useState<Range>();

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Placeholder.configure({
                placeholder: 'Type Something'
            }),
            Link.configure({
               autolink: false,
                linkOnPaste: false,
                openOnClick: false,
                HTMLAttributes: {
                   target: ''
                }
            }),
            Youtube.configure({
                width: 840,
                height: 472.5,
                HTMLAttributes: {
                    class: 'mx-auto rounded'
                }
            }),
            TipTapImage.configure({
                HTMLAttributes: {
                    class: 'mx-auto'
                }
            })
        ],
        editorProps: {
            handleClick(view, pos) {
                const { state } = view;
                const selectionRange = getMarkRange(
                    state.doc.resolve(pos),
                    state.schema.marks.link
                );
                if (selectionRange) setSelectionRange(selectionRange);
            },
            attributes: {
                class: 'prose prose-lg focus:outline-none dark:prose-invert max-w-full mx-auto h-full'
            }
        }
    });

    useEffect(()=> {
        if(editor && selectionRange) {
            editor.commands.setTextSelection(selectionRange);
        }
    }, [editor, selectionRange])

    const handleImageSelection = (result: ImageSelectionResult) => {
        editor
            ?.chain()
            .focus()
            .setImage({src: result.src, alt: result.altText})
            .run();
    }

    return (
        <>
            <div className='p-3 dark:bg-primary-dark bg-primary transition text-primary-dark'>
                <ToolBar editor={editor} onOpenImageClick={() => setShowGallery(true)}/>
                <div className='h-[1px] w-full bg-secondary-dark dark:bg-secondary-light my-3'/>
                {editor ? <EditLink editor={editor}/> : null}
                <EditorContent editor={editor}/>
            </div>
            <GalleryModal visible={showGallery}
                          onClose={() => setShowGallery(false)}
                          onSelect={handleImageSelection}
                          onFileUpload={() => null}/>
        </>
    );
}

export default Editor;
