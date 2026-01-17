import { Country, Job } from "@/types";
import { JobFilterParams } from "./shared.types";

let cachedCountries: any[] | null = null;
// Country List in Alphabetical order
export const fetchCountries = async () => {
  if (cachedCountries) {
    console.log("Returning cached countries");
    return cachedCountries;
  }

  console.log("Fetching countries from API...");

  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name",
    );

    if (!response.ok) {
      throw new Error("Failed to fetch countries");
    }

    let data = [];
    try {
      data = await response.json();
    } catch (error) {
      throw new Error("Failed to parse countries API response as JSON");
    }

    // Sort by country alphabetically
    const sortedData = data.sort((a: any, b: any) =>
      a.name.common.localeCompare(b.name.common),
    );

    // Save to cache
    cachedCountries = sortedData;

    return sortedData;
  } catch (error) {
    console.error(error);
    return [];
  }
};

let cachedCountryCode: string | null = null;
// Fetch user's Location
export const fetchLocation = async () => {
  // if (cachedCountryCode) return cachedCountryCode;
  if (cachedCountryCode) {
    console.log("Returning cached country code");
    return cachedCountryCode;
  }

  console.log("Fetching Location from API...");

  const response = await fetch("https://api.country.is");
  const location = await response.json();
  cachedCountryCode = location.country;

  // console.log(location);

  return cachedCountryCode;
};

//* In-memory cache
const jobCache = new Map<string, Job[]>();
const jobPromiseCache = new Map<string, Promise<Job[]>>();

// Fetch Jobs
export const fetchJobs = async (filters: JobFilterParams): Promise<Job[]> => {
  const { query = "developer", country = "ph", page = 1 } = filters;
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedCountry = country.toLowerCase();
  const cacheKey = `${normalizedQuery}-${normalizedCountry}-${page}`;

  // Return cached result if available
  if (jobCache.has(cacheKey)) {
    console.log("Returning cached jobs ✅", cacheKey);
    return jobCache.get(cacheKey)!;
  }

  // Return in-progress promise if another request is fetching
  if (jobPromiseCache.has(cacheKey)) {
    console.log("Returning cached promise jobs 🔄", cacheKey);
    return jobPromiseCache.get(cacheKey)!;
  }

  console.log("Fetching jobs from API... ", cacheKey);

  const apiKey = process.env.NEXT_RAPID_API_KEY;
  if (!apiKey) throw new Error("Missing RapidApi key");

  const headers = {
    "X-RapidAPI-Key": apiKey,
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
  };

  const params = new URLSearchParams({
    query: normalizedQuery,
    country: normalizedCountry,
    page: page.toString(),
  });

  try {
    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?${params.toString()}`,
      { headers },
    );

    if (!response.ok) {
      const { message } = await response.json().catch(() => ({}));
      throw new Error(
        message ||
          `Failed to fetch jobs: ${response.status} ${response.statusText}`,
      );
    }

    const result = await response.json();

    //* Save the result in cache
    jobCache.set(cacheKey, result.data);
    return result.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};
