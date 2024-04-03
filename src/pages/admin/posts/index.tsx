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
import InfiniteScrollPost from "components/components/common/InfiniteScrollPost";
import axios from "axios";

let pageNo = 0;
const limit = 9;

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Posts: NextPage<Props> = ({ posts }) => {
  const [postsToRender, setPostsToRender] = useState(posts);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const fetchMorePosts = async () => {
    try {
      pageNo++;
      const { data } = await axios(
        `/api/posts?limit=${limit}&pageNo=${pageNo}`
      );
      if (data.posts.length < limit) {
        setPostsToRender([...postsToRender, ...data.posts]);
        setHasMorePosts(false);
      } else {
        setPostsToRender([...postsToRender, ...data.posts]);
      }
    } catch (error) {
      setHasMorePosts(false);
    }
  };
  return (
    <AdminLayout>
      <InfiniteScrollPost
        hasMore={hasMorePosts}
        next={fetchMorePosts}
        dataLength={postsToRender.length}
        posts={postsToRender}
        showControls
      />
    </AdminLayout>
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
