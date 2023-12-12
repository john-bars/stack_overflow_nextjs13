"use client";
import { HomePageFilters } from "@/constants/filters";
import { useState } from "react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

const HomeFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [active, setActive] = useState("");

  const handleTypeClick = (item: string) => {
    // Check if the clicked item is already active
    if (active === item) {
      setActive(""); // if active, deactivate it

      // Reset the filter query by setting its value to null
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: null,
      });

      // Navigate to the new URL without scrolling
      router.push(newUrl, { scroll: false });
    } else {
      // If clicked item is not active, activate it
      setActive(item);

      // Set the filter query to the lowercase value of the clicked item
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: item.toLowerCase(),
      });

      // Navigate to the new URL without scrolling
      router.push(newUrl, { scroll: false });
    }
  };
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex ">
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => handleTypeClick(item.value)}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            active === item.value
              ? "bg-primary-100 text-primary-500 dark:bg-dark-400"
              : "background-light800_darkgradient text-light-500"
          }`}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
