"use client";

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { formatNumberWithExtension } from "@/lib/utils";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasupVoted: boolean;
  downvotes: number;
  hasdownVoted: boolean;
  hasSaved?: boolean; // optional
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasupVoted,
  downvotes,
  hasdownVoted,
  hasSaved,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const handleSave = () => {};

  const handleVote = async (action: string) => {
    const voteData = {
      questionId: JSON.parse(itemId),
      answerId: JSON.parse(itemId),
      userId: JSON.parse(userId),
      hasupVoted,
      hasdownVoted,
      path: pathname,
    };

    if (!userId) {
      return;
    }

    // Call the server action for upvote
    if (action === "upvote") {
      if (type === "Question") {
        await upvoteQuestion(voteData);
      } else if (type === "Answer") {
        await upvoteAnswer(voteData);
      }
      // todo: show a toast
    }

    // Call the server action for downvote
    if (action === "downvote") {
      if (type === "Question") {
        await downvoteQuestion(voteData);
      } else if (type === "Answer") {
        await downvoteAnswer(voteData);
      }
      // todo: show a toast
    }
  };

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasupVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            alt="upvote"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => handleVote("upvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumberWithExtension(upvotes)}
            </p>
          </div>
        </div>

        <div className="flex-center gap-1.5">
          <Image
            src={
              hasdownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            alt="downvote"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => handleVote("downvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumberWithExtension(downvotes)}
            </p>
          </div>
        </div>
      </div>

      {type === "Question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          alt="star"
          width={18}
          height={18}
          onClick={() => handleSave()}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default Votes;
