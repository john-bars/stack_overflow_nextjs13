import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import AnswerCard from "../cards/AnswerCard";
import Pagination from "./Pagination";
import { Suspense } from "react";

interface Props extends SearchParamsProps {
  userId: string;
  currentUserId: string | null;
}

const AnswersTab = async ({ searchParams, userId, currentUserId }: Props) => {
  const { page = "1" } = await searchParams;
  const result = await getUserAnswers({
    userId,
    page: Number(page),
  });
  // console.log("userAnswers: ", result);
  return (
    <>
      {result.answers.map((answer) => (
        <AnswerCard
          key={answer._id.toString()}
          _id={answer._id.toString()}
          currentUserId={currentUserId}
          question={{
            _id: answer.question._id.toString(),
            title: answer.question.title,
          }}
          author={{
            _id: answer.author._id.toString(),
            name: answer.author.name,
            picture: answer.author.picture,
          }}
          upvotes={answer.upvotes.length}
          createdAt={answer.createdAt.toISOString()}
        />
      ))}
      <div className="mt-10 w-full">
        <Suspense fallback={null}>
          <Pagination pageNumber={Number(page)} isNext={result.isNextAnswer} />
        </Suspense>
      </div>
    </>
  );
};

export default AnswersTab;
