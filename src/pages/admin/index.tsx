import {NextPage} from 'next';
import AdminNav from 'components/components/common/AdminNav';
import {
    AiOutlineDashboard,
    AiOutlineContainer,
    AiOutlineTeam,
    AiOutlineMail
} from 'react-icons/ai';

interface Props {
}

const navItems = [
    {href: 'admin/', icon: AiOutlineDashboard, label: 'Dashboard'},
    {href: 'admin/posts', icon: AiOutlineContainer, label: 'Posts'},
    {href: 'admin/users', icon: AiOutlineTeam, label: 'Users'},
    {href: 'admin/comments', icon: AiOutlineMail, label: 'Comments'},
];
const Admin: NextPage<Props> = () => {
    return (
        <div className='dark'>
            <AdminNav navItems={navItems}></AdminNav>
        </div>
    );
};

export default Admin;
