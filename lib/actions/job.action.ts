import { Country } from "@/types";
import { JobFilterParams } from "./shared.types";

// Country List in Alphabetical order
export const fetchCountries = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();

    const countryNames = data.map((country: Country) => country.name.common);
    const sortedCountryNames = countryNames.sort();

    return sortedCountryNames;
  } catch (error) {
    console.log(error);
  }
};

// Fetch user's Location
export const fetchLocation = async () => {
  const response = await fetch("http://ip-api.com/json/?fields=country");
  const location = await response.json();
  return location.country;
};

// Fetch Jobs
export const fetchJobs = async (filters: JobFilterParams) => {
  const { query, page } = filters;
  const headers = {
    "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY ?? "",
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
  };

  const response = await fetch(
    `https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}`,
    {
      headers,
    }
  );

  const result = await response.json();
  return result.data;
};
