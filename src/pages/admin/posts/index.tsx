import {NextPage} from 'next';
import AdminLayout from '../../../components/layout/AdminLayout';

interface Props {
}

const Posts: NextPage<Props> = () => {
    return (
        <div className='dark'>
            <AdminLayout>
                posts
            </AdminLayout>
        </div>
    );
};

export default Posts;

