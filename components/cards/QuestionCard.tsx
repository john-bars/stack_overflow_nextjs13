import Link from "next/link";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { formatNumberWithExtension, getTimestamp } from "@/lib/utils";
import EditDeleteAction from "../shared/EditDeleteAction";

interface Answer {
  answerId: string;
  text: string;
}

interface QuestionCardProps {
  isAuthenticated?: boolean;
  currentUserId?: string | null;
  _id: string;
  title: string;
  tags: { _id: string; name: string }[];
  author: { id: string; name: string; picture: string };
  upvotes: string[];
  views: number;
  answers: Answer[];
  createdAt: Date;
}

const QuestionCard = ({
  isAuthenticated,
  currentUserId,
  _id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
}: QuestionCardProps) => {
  const showActionButtons = currentUserId && currentUserId === author.id;
  // console.log("currentUserId: ", currentUserId);
  // console.log("authorId: ", author.id);

  return (
    <div className="card-wrapper rounded-xl p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          {/* Only visible for mobile devices */}
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>

          {/* title */}
          {isAuthenticated ? (
            <Link href={`/question/${_id}`}>
              <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
                {title}
              </h3>
            </Link>
          ) : (
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          )}
        </div>

        {showActionButtons && (
          <EditDeleteAction type="Question" itemId={`${_id}`} />
        )}
      </div>

      {/* Display Tags */}
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>

      {/* Display Metrics */}
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="User Profile"
          value={author.name}
          title={` - asked ${getTimestamp(createdAt)}`}
          href={`/profile/${author.id}`}
          isAuthor
          textStyles="body-medium text-dark400_light700"
        />
        <div className="flex-between gap-3">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes icon"
            value={formatNumberWithExtension(upvotes?.length ?? 0)}
            title="Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="Answers icon"
            value={formatNumberWithExtension(answers?.length ?? 0)}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="Views icon"
            value={formatNumberWithExtension(views ?? 0)}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
