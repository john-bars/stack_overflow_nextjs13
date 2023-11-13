import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";

const questions = [
  {
    _id: "1",
    title:
      "Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
    tags: [{ _id: "1", name: "next.js" }],
    author: { _id: "101", name: "Sujata", picture: "/path/to/sujata.jpg" },
    upvotes: 55,
    answers: [{ answerId: "A1", text: "Some answer text" }],
    views: 2800,
    createdAt: new Date("2023-11-13T12:00:00.000Z"),
  },
  {
    _id: "2",
    title: "How do I use express as a custom server in NextJS?",
    tags: [
      { _id: "2", name: "next13" },
      { _id: "3", name: "express" },
      { _id: "4", name: "fastify" },
    ],
    author: { _id: "102", name: "Brandon", picture: "/path/to/brandon.jpg" },
    upvotes: 2,
    answers: [
      { answerId: "A2", text: "Express can be used as follows..." },
      { answerId: "A3", text: "Another answer here." },
    ],
    views: 368,
    createdAt: new Date("2023-11-13T13:00:00.000Z"),
  },
];

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="flex-between mt-11 gap-5 max-sm:flex-col">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions..."
          otherClasses="flex-1"
        />
        {/* Visible for mobile-medium devices */}
        <Filter
          filters={HomePageFilters}
          containerClasses="hidden max-md:flex" // display as flex for screen size within 768px, hidden for larger device
          otherClasses="sm:min-w-[170px] min-h-[56px]"
        />
      </div>
      {/* Visible for large devices */}
      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
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
            title="There's no question to show"
            description="Be the first to break the silence! Ask a Question and kickstart the
            discussion. Our query could be the next big thing others learn from. Get
            involved!"
            link="/"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
