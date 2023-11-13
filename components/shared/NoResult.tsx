"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

interface NoResultProps {
  title: string;
  description: string;
  link: string;
  linkTitle: string;
}

const NoResult = ({ title, description, link, linkTitle }: NoResultProps) => {
  return (
    <div className="flex-center mt-10 w-full flex-col">
      {/* Image for light mode */}
      <Image
        src="/assets/images/light-illustration.png"
        alt="No result illustration"
        width={270}
        height={270}
        className="block w-auto object-contain dark:hidden"
      />
      {/* Image for dark mode */}
      <Image
        src="/assets/images/dark-illustration.png"
        alt="No result illustration"
        width={270}
        height={270}
        className="hidden w-auto object-contain dark:block"
      />
      <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>
      <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
        {description}
      </p>
      <Link href={link}>
        <Button
          className="paragraph-medium mt-5 min-h-[36px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500/90 dark:bg-primary-500/80 
        dark:text-light-900 dark:hover:bg-primary-500"
        >
          {linkTitle}
        </Button>
      </Link>
    </div>
  );
};

export default NoResult;
