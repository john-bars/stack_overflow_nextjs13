"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

const LocalSearchbar = () => {
  return (
    <div className="background-light800_darkgradient flex min-h-[56px] w-full grow items-center gap-3 rounded-xl px-4">
      <Image
        src="/assets/icons/search.svg"
        alt="search icon"
        width={24}
        height={24}
        className="cursor-pointer"
      />

      <Input
        type="text"
        placeholder="Search questions..."
        value=""
        onChange={() => {}}
        className="paragraph-regular no-focus placeholder border-none  bg-transparent shadow-none outline-none"
      />
    </div>
  );
};

export default LocalSearchbar;
