import DefaultLayout from "components/components/layout/DefaultLayout";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { formatPosts, readPostsFromDb } from "../../lib/utils";
import { PostDetail } from "../../utils/type";
import InfiniteScrollPost from "../components/common/InfiniteScrollPost";
import { useState } from "react";
import axios from "axios";

let pageNo = 0;
const limit = 9;

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export const Home: NextPage<Props> = ({ posts }) => {
  const [postsToRender, setPostsToRender] = useState(posts);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const isAdmin = false;

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
    <DefaultLayout>
      <div className="pb-20">
        <InfiniteScrollPost
          hasMore={hasMorePosts}
          next={fetchMorePosts}
          dataLength={postsToRender.length}
          posts={postsToRender}
          showControls={isAdmin}
        />
      </div>
    </DefaultLayout>
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

export default Home;
