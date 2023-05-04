import {FC} from 'react';
import {Editor} from '@tiptap/react';
import DropdownOptions from '../../common/DropdownOptions';
import {AiFillCaretDown} from 'react-icons/ai';
import {gefFocusEditor} from '../EditorUtils';
import Button from '../../common/Button';
import {
    BsBraces,
    BsCode, BsImageFill,
    BsListOl, BsListUl,
    BsTypeBold,
    BsTypeItalic,
    BsTypeStrikethrough,
    BsTypeUnderline, BsYoutube
} from 'react-icons/bs';
import {RiDoubleQuotesL} from 'react-icons/ri';
import InsertLink from 'components/components/editor/Link/InsertLink';
import {LinkOption} from 'components/components/editor/Link/LinkForm';
import EmbedYoutube from 'components/components/editor/ToolBar/EmbedYoutube';

interface Props {
    onOpenImageClick?(): void;
    editor: Editor | null
}

const ToolBar: FC<Props> = ({editor, onOpenImageClick}): JSX.Element | null => {
    const options = [
        {
            label: "Paragraph",
            onClick: () => gefFocusEditor(editor)?.setParagraph().run()},
        {
            label: "Heading 1",
            onClick: () => gefFocusEditor(editor)?.toggleHeading({level: 1}).run()},
        {
            label: "Heading 2",
            onClick: () => gefFocusEditor(editor)?.toggleHeading({level: 2}).run()},
        {
            label: "Heading 3",
            onClick: () => gefFocusEditor(editor)?.toggleHeading({level: 3}).run()},
    ];

    const getLabel = (): string => {
        if(editor?.isActive('heading', {level: 1})) return "Heading 1";
        if(editor?.isActive('heading', {level: 2})) return "Heading 2";
        if(editor?.isActive('heading', {level: 3})) return "Heading 3";
        return 'Paragraph';
    }

    const handleLinkSubmit = ({url, openInNewTab}: LinkOption) => {
        const target = openInNewTab ? '_blank' : undefined;
        editor?.commands?.setLink({href: url, target})
    }

    const Head = () => {
        return (<div className='flex items-center space-x-2 text-primary-dark dark:text-primary'>
            <p>{getLabel()}</p>
            <AiFillCaretDown/>
        </div>)
    }

    if (!editor) return null;

    const handleEmbedYoutube = (url: string) => {
        editor
            .chain()
            .focus()
            .setYoutubeVideo({src: url})
            .run()
    }

    return (
        <div className='flex items-center'>
            {/* paragraph, heading 1,2,3 */}
            <DropdownOptions options={options} head={<Head/>}></DropdownOptions>
            <div className='h-4 w-[1px] bg-secondary-dark dark:bg-secondary-light mx-8'/>
            <div className='flex items-center space-x-3'>
                <Button
                    active={editor.isActive('bold')}
                    onClick={() => gefFocusEditor(editor)?.toggleBold().run()}>
                    <BsTypeBold/>
                </Button>
                <Button
                    active={editor.isActive('italic')}
                    onClick={() => gefFocusEditor(editor)?.toggleItalic().run()}>
                    <BsTypeItalic/>
                </Button>
                <Button
                    active={editor.isActive('underline')}
                    onClick={() => gefFocusEditor(editor)?.toggleUnderline().run()}>
                    <BsTypeUnderline/>
                </Button>
                <Button
                    active={editor.isActive('strike')}
                    onClick={() => gefFocusEditor(editor)?.toggleStrike().run()}>
                    <BsTypeStrikethrough/>
                </Button>
            </div>
            <div className='h-4 w-[1px] bg-secondary-dark dark:bg-secondary-light mx-8'/>
            <div className='flex items-center space-x-3'>
                <Button
                    active={editor.isActive('blockquote')}
                    onClick={() => gefFocusEditor(editor)?.toggleBlockquote().run()}>
                    <RiDoubleQuotesL/>
                </Button>
                <Button
                    active={editor.isActive('code')}
                    onClick={() => gefFocusEditor(editor)?.toggleCode().run()}>
                    <BsCode/>
                </Button>
                <Button
                    active={editor.isActive('codeBlock')}
                    onClick={() => gefFocusEditor(editor)?.toggleCodeBlock().run()}>
                    <BsBraces/>
                </Button>
                <InsertLink onSubmit={handleLinkSubmit}/>
                <Button
                    active={editor.isActive('orderedList')}
                    onClick={() => gefFocusEditor(editor)?.toggleOrderedList().run()}>
                    <BsListOl/>
                </Button>
                <Button
                    active={editor.isActive('bulletList')}
                    onClick={() => gefFocusEditor(editor)?.toggleBulletList().run()}>
                    <BsListUl/>
                </Button>
            </div>
            <div className='h-4 w-[1px] bg-secondary-dark dark:bg-secondary-light mx-8'/>
            <div className='flex items-center space-x-3'>
                <EmbedYoutube onSubmit={handleEmbedYoutube}/>
                <Button onClick={onOpenImageClick}>
                    <BsImageFill/>
                </Button>
            </div>
        </div>
    );
}

export default ToolBar;
