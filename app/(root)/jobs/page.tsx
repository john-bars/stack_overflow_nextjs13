import JobCard from "@/components/cards/JobCard";
import JobsFilter from "@/components/jobs/JobsFilter";
import Pagination from "@/components/shared/Pagination";
import {
  fetchCountries,
  fetchJobs,
  fetchLocation,
} from "@/lib/actions/job.action";
import { Job, SearchParamsProps } from "@/types";

const Page = async ({ searchParams }: SearchParamsProps) => {
  const [countries, userCountryCode] = await Promise.all([
    fetchCountries(),
    fetchLocation(),
  ]);
  const countryName = countries.map((c: any) => c.name.common);

  const params = await searchParams;
  const { q, country, page } = params ?? {};

  let jobs: readonly Job[] = [];
  let error: Error | null = null;

  try {
    jobs = await fetchJobs({
      query: q || "developer",
      country: country || userCountryCode || "ph",
      page: Number(page) || 1,
    });
  } catch (err) {
    error = err as Error;
  }

  // console.log(countryName);
  // console.log(userCountryCode);
  // console.log(jobs);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>

      <div className="flex">
        <JobsFilter countriesList={countryName} />
      </div>

      {/* <section className="light-border mb-9 mt-11 flex flex-col gap-9 border-b pb-9">
        {!error && jobs?.length > 0 ? (
          jobs.map((job: Job) =>
            job.job_title && job.job_title.toLowerCase() !== "undefined" ? (
              <JobCard key={job.id} job={job} />
            ) : null
          )
        ) : (
          <div className="paragraph-regular text-dark200_light800 w-full text-center">
            Oops! We couldn&apos;t find any job at the moment. Please try again
            later
          </div>
        )}
      </section>

      {!error && jobs?.length > 0 && (
        <Pagination pageNumber={Number(page)} isNext={jobs.length === 10} />
      )} */}
    </>
  );
};

export default Page;
