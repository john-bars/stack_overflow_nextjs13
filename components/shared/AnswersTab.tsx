import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import AnswerCard from "../cards/AnswerCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId: string | null;
}

const AnswersTab = async ({ searchParams, userId, clerkId }: Props) => {
  const { page = "1" } = await searchParams;
  const result = await getUserAnswers({
    userId,
    page: Number(page),
  });
  // console.log("userAnswers: ", result);
  return (
    <>
      {result.answers.map((item) => (
        <AnswerCard
          key={item._id}
          _id={item._id}
          clerkId={clerkId}
          question={item.question}
          author={item.author}
          upvotes={item.upvotes.length}
          createdAt={item.createdAt}
        />
      ))}
      <div className="mt-10 w-full">
        <Pagination pageNumber={Number(page)} isNext={result.isNextAnswer} />
      </div>
    </>
  );
};

export default AnswersTab;
