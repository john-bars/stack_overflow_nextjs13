"use client";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeyFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface LocalSearchbarProps {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearchbar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: LocalSearchbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // const query = searchParams.get("q");
  const initialQuery = searchParams.get("q") ?? "";
  const [search, setSearch] = useState(initialQuery);
  const mountedRef = useRef(false);

  useEffect(() => {
    // Prevent running on first render
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      const currentQuery = searchParams.get("q") ?? "";

      // Prevent unecessary navigation
      if (search === currentQuery) return;

      // If 'search' is not empty, update the URL and trigger a search
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });

        router.replace(newUrl, { scroll: false });
      } else if (pathname === route) {
        // if 'search' is empty, remove the query key 'q'
        const newUrl = removeKeyFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["q"],
        });

        router.replace(newUrl, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, route, pathname, router]);

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] w-full grow items-center gap-4 rounded-xl px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && imgSrc && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}

      <Input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="paragraph-regular text-dark400_light700 no-focus placeholder border-none  bg-transparent shadow-none outline-none"
      />

      {iconPosition === "right" && imgSrc && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearchbar;
