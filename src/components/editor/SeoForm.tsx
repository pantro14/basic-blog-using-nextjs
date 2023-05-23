import {ChangeEventHandler, FC, useEffect, useState} from 'react';
import classnames from 'classnames';
import slugify from 'slugify';

export interface SeoResult {
    meta: string;
    slug: string;
    tags: string;
}

interface Props {
    title?: string;
    onChange(result: SeoResult): void;
    initialValue?: SeoResult
}

const commonInput = 'w-full bg-transparent outline-none border-2 border-secondary-dark focus:border-primary-dark focus:dark:border-primary rounded transition p-2 text-primary-dark dark:text-primary';

const SeoForm: FC<Props> = ({ title = '', onChange, initialValue }): JSX.Element => {
    const [values, setValues] = useState({meta: '', slug: '', tags: ''});
    const { meta, slug, tags } = values;

    useEffect(() => {
        const slug = slugify(title?.toLowerCase());
        const newValues = { ...values, slug };
        setValues(newValues);
    }, [title]);

    useEffect(() => {
        if(initialValue) {
            setValues({...initialValue, slug: slugify(initialValue.slug)});
        }
    }, [initialValue]);

    const handleChange:  ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = ({ target }) => {
        let {name, value} = target;
        if(name === 'meta') value = value.substring(0, 150);
        const newValues = {...values, [name]: value};
        setValues(newValues);
        onChange(newValues);
    }

    return (
        <div className='space-y-4'>
            <h1 className='text-primary-dark dark:text-primary text-xl font-semibold'>
                SEO Section
            </h1>
            <Input value={slug}
                   name='slug'
                   placeholder='slug-goes-here'
                   label='Slug:'
                   onChange={handleChange}/>
            <Input value={tags}
                   name='tags'
                   placeholder='React, Next JS'
                   label='Tags:'
                   onChange={handleChange} />
            <div className='relative'>
                <textarea value={meta}
                          name='meta'
                          className={classnames(commonInput, 'text-lg h-20 resize-none')}
                          placeholder='Meta Description'
                          onChange={handleChange} />
                <p className='absolute bottom-3 right-3 text-primary-dark dark:text-primary'>
                    {meta.length}/150
                </p>
            </div>
        </div>
    );
}

const Input: FC<{
    name?: string;
    value?: string;
    placeholder?: string;
    label?: string;
    onChange?:  ChangeEventHandler<HTMLInputElement>;
}> = ({ name, value, placeholder, label, onChange}) => {
    return (
        <label className='block relative'>
                <span className='absolute top-1/2 -translate-y-2 text-sm font-semibold text-primary-dark dark:text-primary
                        pl-2'>
                    {label}
                </span>
            <input className={classnames(commonInput, 'italic pl-11')}
                   type='text'
                   name={name}
                   value={value}
                   placeholder={placeholder}
                   onChange={onChange}/>
        </label>
    )
}

export default SeoForm;
