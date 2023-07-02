import {FinalPost} from 'components/components/editor';

export const generateFormData = (post: FinalPost) => {
    const formData = new FormData()
    for(let key in post) {
        const value = (post as any)[key];
        if(key === 'tags' && value.trim()) {
            const tags = value.split(',').map((item: string) => item.trim());
            formData.append('tags', JSON.stringify(tags));
        } else {
            formData.append(key, value);
        }
    }
    return formData;
}
