import {ChangeEventHandler, FC, useEffect, useState} from 'react';
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
import axios from 'axios';
import SeoForm, {SeoResult} from './SeoForm';
import ActionButton from '../common/ActionButton';
import ThumbnailSelector from './ThumbnailSelector';

export interface FinalPost extends SeoResult{
    id?: string;
    title: string;
    content: string;
    thumbnail?: File | string;
}

interface Props {
    initialValue?: FinalPost;
    btnTitle?: string;
    busy?: boolean;
    onSubmit(post: FinalPost): void;
}

const Editor: FC<Props> = (
    {
        initialValue,
        btnTitle = 'Submit',
        busy = false,
        onSubmit
    }): JSX.Element => {
    const [showGallery, setShowGallery] = useState(false);
    const [selectionRange, setSelectionRange] = useState<Range>();
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<{src: string}[]>([]);
    const [seoInitialValue, setSeoInitialValue] = useState<SeoResult>();
    const [post, setPost] = useState<FinalPost>({
        title: '',
        content: '',
        meta: '',
        tags: '',
        slug: ''
    })

    const fetchImages = async () => {
        const { data } = await axios('/api/image');
        setImages(data.images);
    }

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
    }, [editor, selectionRange]);

    useEffect(()=> {
       fetchImages();
    }, []);

    useEffect(()=> {
        if(initialValue) {
            setPost({...initialValue});
            editor?.commands.setContent(initialValue.content);
            const { meta, slug, tags } = initialValue;
            setSeoInitialValue({ meta, slug, tags });
        }
    }, [initialValue, editor]);

    const handleImageSelection = (result: ImageSelectionResult) => {
        editor
            ?.chain()
            .focus()
            .setImage({src: result.src, alt: result.altText})
            .run();
    }

    const handleImageUpload = async (
        image: File
    ) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', image)
        const { data } = await axios.post('/api/image', formData);
        setUploading(false);
        setImages([data, ...images]);
    }

    const updateTitle: ChangeEventHandler<HTMLInputElement> =
        ({ target }) => setPost({...post, title: target.value});

    const updateSeoValue = (result: SeoResult) => setPost({...post, ...result});

    const updateThumbnail = (file: File) => setPost({...post, thumbnail: file});

    const handleSubmit = () => {
        if(!editor) return;
        onSubmit({...post, content: editor.getHTML() });
    };

    return (
        <>
            <div className='p-3 dark:bg-primary-dark bg-primary transition text-primary-dark'>
                <div className='sticky top-0 z-10 dark:bg-primary-dark bg-primary'>
                    {/* Thumbnail selector and submit button */}
                    <div className='flex items-center justify-between mb-3'>
                        <ThumbnailSelector
                            initialValue={post.thumbnail as string}
                            onChange={updateThumbnail}/>
                        <div className='inline-block'>
                            <ActionButton
                                title={btnTitle}
                                busy={busy}
                            onClick={handleSubmit}></ActionButton>
                        </div>
                    </div>
                    {/* Title Input */}
                    <input type='text'
                           className='bg-transparent w-full border-0 border-b-[1px]
                py-2 outline-none
                border-secondary-dark dark:border-secondary-light text-3xl font-semibold italic
                text-primary-dark dark:text-primary mb-3'
                           placeholder='Title'
                           onChange={updateTitle}
                           value={post.title}
                    />
                    <ToolBar editor={editor} onOpenImageClick={() => setShowGallery(true)}/>
                    <div className='h-[1px] w-full bg-secondary-dark dark:bg-secondary-light my-3'/>
                </div>
                {/* Text Editor */}
                {editor ? <EditLink editor={editor}/> : null}
                <EditorContent editor={editor} className='min-h-[300px]'/>
                <div className='h-[1px] w-full bg-secondary-dark dark:bg-secondary-light my-3'/>
                {/* Seo Form */}
                <SeoForm title={post.title}
                         onChange={updateSeoValue}
                         initialValue={seoInitialValue}
                />
            </div>
            <GalleryModal visible={showGallery}
                          images={images}
                          onClose={() => setShowGallery(false)}
                          onSelect={handleImageSelection}
                          onFileUpload={handleImageUpload}
                          uploading={uploading}/>
        </>
    );
}

export default Editor;
