import {GetServerSideProps, NextPage} from 'next';

interface Props {
}

const Update: NextPage<Props> = () => {
    return (
        <div>
            Update
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {props: {}}
}

export default Update;
