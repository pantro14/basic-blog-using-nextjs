import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import AdminLayout from "../../../components/layout/AdminLayout";
import { useState } from "react";
import PostCard from "../../../components/common/PostCard";
import { PostDetail } from "../../../../utils/type";
import { formatPosts, readPostsFromDb } from "../../../../lib/utils";

let pageNo = 0;
const limit = 9;

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Posts: NextPage<Props> = ({ posts }) => {
  const [postsToRender, setPostsToRender] = useState(posts);
  return (
    <div className="dark">
      <AdminLayout>
        <div className="max-w-4xl mx-auto p-3">
          <div className="grid grid-cols-3 gap-4">
            {postsToRender.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </AdminLayout>
    </div>
  );
};

interface ServerSideResponse {
  posts: PostDetail[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // read posts
    const posts = await readPostsFromDb(limit, pageNo);
    //format posts
    const formattedPosts = formatPosts(posts);
    return {
      props: {
        posts: formattedPosts,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};

export default Posts;
