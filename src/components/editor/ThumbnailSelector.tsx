import {ChangeEventHandler, FC, useEffect, useState} from 'react';
import classNames from 'classnames';

const commonClass = 'border border-dashed border-secondary-dark flex items-center justify-center rounded cursor-pointer aspect-video';

interface Props {
    initialValue?: string;
    onChange(file: File): void
}

const ThumbnailSelector: FC<Props> = ({
    initialValue,
    onChange
}): JSX.Element => {
    const [selectedThumbnail, setSelectedThumbnail] = useState('');
    const handleChange:  ChangeEventHandler<HTMLInputElement> = ({
        target
    }) => {
        const { files } = target;
        if(!files) return;
        const file = files[0];
        setSelectedThumbnail(URL.createObjectURL(file));
        onChange(file);
    };

    useEffect(() => {
        if( typeof initialValue === 'string') setSelectedThumbnail(initialValue);
    }, [initialValue])
    return (
        <div className='w-32'>
            <input type='file'
                   accept='image/jpg, image/png, image/jpeg'
                   hidden
                   id='thumbnail'
                   onChange={handleChange}
            />
            <label htmlFor='thumbnail'>
                {selectedThumbnail ?
                    <img src={selectedThumbnail} alt='' className={classNames(commonClass, 'object-cover')}/>
                    :
                    <PosterUI label='Thumbnail'/>
                }
            </label>
        </div>
    );
}

const PosterUI: FC<{label: string; className?: string }> = ({
    label,
    className
}): JSX.Element => {
    return (
        <div className={classNames(commonClass, className)}>
            <span>{label}</span>
        </div>
    );
}

export default ThumbnailSelector;
