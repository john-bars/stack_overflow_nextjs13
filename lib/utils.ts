import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimestamp = (createdAt: Date): string => {
  const now = new Date();
  const timeDifference = now.getTime() - createdAt.getTime();

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} year${years === 1 ? "" : "s"} ago`;
  } else if (months > 0) {
    return `${months} month${months === 1 ? "" : "s"} ago`;
  } else if (days > 0) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  } else {
    return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
  }
};

export const formatNumberWithExtension = (number: number): string => {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  } else {
    return number.toString();
  }
};

export const getJoinedDate = (inputDate: Date): string => {
  // Get the month and year from the Date object
  const month = inputDate.toLocaleString("default", { month: "long" });
  const year = inputDate.getFullYear();

  // Create a string with the joined date format
  const joinedDate = `${month} ${year}`;

  return joinedDate;
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

// UPDATE THE URL QUERY
export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  // Parse the existing URL query string into an object
  const currentUrl = qs.parse(params);

  // Update the object with the new key-value pair or remove the key if value is null
  currentUrl[key] = value;

  // Convert the updated object back into a URL query string
  return qs.stringifyUrl(
    {
      url: window.location.pathname, // the current URL path
      query: currentUrl, // the updated query parameter
    },
    { skipNull: true }
  );
};

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

// REMOVE KEYS FROM QUERY
export const removeKeyFromQuery = ({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) => {
  // Parse the existing URL query string into an object
  const currentUrl = qs.parse(params);

  // Remove specified keys from the URL parameters object
  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  // Convert the updated object back into a URL query string
  return qs.stringifyUrl(
    {
      url: window.location.pathname, // the current URL path
      query: currentUrl, // the updated query parameter
    },
    { skipNull: true }
  );
};
