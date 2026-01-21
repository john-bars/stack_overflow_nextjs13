import Link from "next/link";
import Metric from "../shared/Metric";
import { formatNumberWithExtension, getTimestamp } from "@/lib/utils";
import EditDeleteAction from "../shared/EditDeleteAction";

interface Props {
  _id: string;
  currentUserId: string | null;
  question: {
    _id: string;
    title: string;
  };
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  upvotes: number;
  createdAt: Date;
}

const AnswerCard = ({
  _id,
  currentUserId,
  question,
  author,
  upvotes,
  createdAt,
}: Props) => {
  console.log("author: ", author);
  const showActionButtons = currentUserId && currentUserId === author._id;

  return (
    <div className="card-wrapper rounded-[10px] px-11 py-9">
      <Link
        href={`/question/${question._id}/#${_id}`}
        className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row"
      >
        <div>
          {/* Only visible for mobile devices */}
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(new Date(createdAt))}
          </span>

          {/* title */}
          <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            {question.title}
          </h3>
        </div>

        {showActionButtons && <EditDeleteAction type="Answer" itemId={_id} />}
      </Link>

      {/* Display Metrics */}
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="user avatar"
          value={author.name}
          title={` • asked ${getTimestamp(new Date(createdAt))}`}
          href={`/profile/${author._id}`}
          isAuthor
          textStyles="body-medium text-dark400_light700"
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="like icon"
          value={formatNumberWithExtension(upvotes)}
          title="Votes"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default AnswerCard;
