import {NextPage} from 'next';
import Editor, {FinalPost} from 'components/components/editor';
import AdminLayout from 'components/components/layout/AdminLayout';
import axios from 'axios';

interface Props {
}

const Create: NextPage<Props> = () => {

    const handleSubmit = async (post: FinalPost) => {
        try {
            //generate FormData
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
            //submit post
            const data = await axios.post('/api/posts', formData);
            console.log(data)
        }catch (error: any) {
            console.log(error.response.data);
        }
    }

    return (
        <AdminLayout title='New Post'>
            <div className='max-w-4xl mx-auto'>
                <Editor onSubmit={handleSubmit}/>
            </div>
        </AdminLayout>
    );
};

export default Create;
