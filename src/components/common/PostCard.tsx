import { FC } from "react";
import { PostDetail } from "../../../utils/type";
import Image from "next/image";
import dateformat from "dateformat";
import Link from "next/link";

interface Props {
  post: PostDetail;
  busy?: boolean;
  onDeleteClick?(): void;
}

const trimText = (text: string, trimBy: number) => {
  if (text.length <= trimBy) return text;
  return text.substring(0, trimBy).trim() + "...";
};

const PostCard: FC<Props> = ({ post, busy, onDeleteClick }): JSX.Element => {
  const { title, slug, meta, tags, thumbnail, createdAt } = post;
  return (
    <div className="rounded shadow-sm shadow-secondary-dark overflow-hidden bg-primary dark:bg-primary-dark transition flex flex-col h-full">
      <div className="aspect-video relative">
        {/* thumbnail */}
        {!thumbnail ? (
          <div className="w-full h-full flex items-center justify-center text-secondary-dark opacity-50 font-semibold">
            No Image
          </div>
        ) : (
          <Image src={thumbnail} fill alt="Thumbail" />
        )}
      </div>

      {/* Post Info */}
      <div className="p-2 flex-1 flex flex-col">
        <Link href={"/" + slug}>
          <div className="flex items-center justify-between text-sm text-primary-dark dark:text-primary">
            <div className="flex items-center space-x-1">
              {tags.map((tag, index) => (
                <span key={tag + index}>{tag}</span>
              ))}
            </div>
            <span>{dateformat(createdAt, "d-mmm-yyyy")}</span>
          </div>

          <h1 className="font-semibold text-primary-dark dark:text-primary">
            {trimText(title, 50)}
          </h1>
          <p className="text-secondary-dark">{trimText(meta, 70)}</p>
        </Link>

        <div className="flex justify-end items-center h-8 mt-auto space-x-4 text-primary-dark dark:text-primary">
          {busy ? (
            <span className="animate-pulse">Removing</span>
          ) : (
            <>
              <Link
                className="hover:underline"
                href={"/admin/posts/update/" + slug}
              >
                Edit
              </Link>
              <button className="hover:underline" onClick={onDeleteClick}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
