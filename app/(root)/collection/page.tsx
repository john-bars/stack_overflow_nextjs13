import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";

export default async function Home({ searchParams }: SearchParamsProps) {
  const { userId, isAuthenticated } = await auth();
  if (!userId) return null;

  const { q = "", filter, page = "1" } = await searchParams;

  const result = await getSavedQuestions({
    clerkId: userId,
    searchQuery: q,
    filter,
    page: Number(page),
  });

  // console.log(result);
  // console.log("searchParams: ", searchParams);
  // console.log("isAuthenticated: ", isAuthenticated);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="flex-between mt-11 gap-5 max-sm:flex-col">
        <LocalSearchbar
          route="/collection"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions..."
          otherClasses="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses="sm:min-w-[170px] min-h-[56px]"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (
            <QuestionCard
              isAuthenticated={isAuthenticated}
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no saved question to show"
            description="Be the first to break the silence! 🚀   Ask a Question and kickstart the
            discussion. Our query could be the next big thing others learn from. Get
            involved!"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>

      <div className="mt-10">
        <Pagination pageNumber={Number(page)} isNext={result.isNext} />
      </div>
    </>
  );
}
