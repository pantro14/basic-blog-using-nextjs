import {ChangeEventHandler, FC, useCallback, useState} from 'react';
import ModalContainer, {ModalProps} from '../../common/ModalContainer';
import Gallery from './Gallery';
import Image from 'next/image';
import ActionButton from 'components/components/common/ActionButton';
import {AiOutlineCloudUpload} from 'react-icons/ai';

export interface ImageSelectionResult {
    src: string;
    altText: string;
}

interface Props extends ModalProps{
    images: {src: string}[],
    uploading?: boolean,
    onFileUpload(image: File): void;
    onSelect(result: ImageSelectionResult): void;
}

const GalleryModal: FC<Props> = (
    {
        images,
        uploading,
        visible,
        onClose,
        onFileUpload,
        onSelect
    }): JSX.Element  => {
    const [altText, setAltText] = useState('');
    const [selectedImage, setSelectedImage] = useState('');

    const handleClose = useCallback(() =>
        onClose && onClose(), [onClose]);

    const handleOnImageChange:  ChangeEventHandler<HTMLInputElement> =
        ({target}) => {
        const {files} = target
        if (!files) return;
        const file = files[0]
        if(!file.type.startsWith('image')) return handleClose();
        onFileUpload(file);
    }

    const  handleSelection = () => {
        if(!selectedImage) return handleClose();
        onSelect({src: selectedImage, altText});
        handleClose();
    }

    return (
        <ModalContainer visible={visible} onClose={onClose}>
            <div className='max-w-4xl px-2 bg-primary-dark dark:bg-primary rounded'>
                <div className='flex'>
                    {/* gallery */}
                    <div className='basis-[75%] max-h-[450px] overflow-y-auto custom-scroll-bar'>
                        <Gallery 
                            images={images}
                            selectedImage={selectedImage}
                            uploading={uploading}
                            onSelect={(src) => setSelectedImage(src)}/>
                    </div>
                    {/* image selection and upload */}
                    <div className='basis-1/4 p-2'>
                        <div className='space-y-4'>
                            <div>
                                <input onChange={handleOnImageChange} hidden type='file' id='image-input'/>
                                <label htmlFor='image-input'>
                                    <div className='w-full border-2 border-action text-action flex items-center justify-center
                                    space-x-2 p-2 cursor-pointer'>
                                        <AiOutlineCloudUpload/>
                                        <span>Upload Image</span>
                                    </div>
                                </label>
                            </div>
                            {selectedImage ? (<>
                            <textarea className='resize-none w-full bg-transparent rounded border-2 border-secondary-dark
                                      focus:ring-1 text-primary dark:text-primary-dark h-32 p-1'
                                      placeholder='Alt text'
                                      value={altText}
                                        onChange={({ target }) => setAltText(target.value)}></textarea>
                                <ActionButton title='Select' onClick={handleSelection}/>
                                <div className='relative aspect-video bg-png-pattern'>
                                    <Image src={selectedImage}
                                           alt='selected'
                                           fill={true}
                                           style={{objectFit:"contain"}}/>
                                </div>
                            </>) : null}
                        </div>
                    </div>
                </div>
            </div>
        </ModalContainer>
    );
}

export default GalleryModal;
