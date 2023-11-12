import React from "react";
import Link from "next/link";

interface RenderTagProps {
  _id: number;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
}

const RenderTag = ({
  _id,
  name,
  totalQuestions,
  showCount,
}: RenderTagProps) => {
  return (
    <Link href="/" key={_id} className="flex-between gap-2">
      <div className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md px-4 py-2">
        {name}
      </div>
      <p className="small-medium text-dark500_light700">{totalQuestions}</p>
    </Link>
  );
};

export default RenderTag;
