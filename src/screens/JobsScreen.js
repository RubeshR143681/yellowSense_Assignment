import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { fetchJobs } from "../services/jobService";
import { useNavigate } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { MdSearch } from "react-icons/md"; // Import the search icon

// Component to display job listings
const JobsScreen = ({ setJobs }) => {
  const [jobs, setJobsLocal] = useState([]); // Local state to store jobs
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [page, setPage] = useState(1); // Current page state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const totalPages = 3; // Total number of pages
  const navigate = useNavigate(); // For navigation

  // JobCard component to display individual job details
  const JobCard = ({ job }) => {
    const handleClick = () => {
      navigate(`/jobs/${job.id}`); // Navigate to job detail page
    };

    // Determine salary display
    const salary =
      job?.primary_details?.Salary === "-"
        ? "Based on Interview"
        : job?.primary_details?.Salary || "Not Available";

    return (
      <div
        className="border p-4 mb-4 rounded-lg shadow-lg gap-3 w-full cursor-pointer flex flex-col justify-center bg-white"
        onClick={handleClick}
      >
        <h2 className="text-lg font-bold">{job.title}</h2>
        <p className="font-semibold">
          Location:
          <span className="font-normal"> {job.primary_details?.Place}</span>
        </p>
        <p className="font-semibold">
          Salary:<span className="font-normal"> {salary}</span>
        </p>
        <p className="font-semibold">
          Experience:{" "}
          <span className="font-normal">{job.primary_details?.Experience}</span>
        </p>
      </div>
    );
  };

  // Fetch jobs when the page number changes
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true); // Set loading to true
      try {
        const data = await fetchJobs(page); // Fetch jobs
        const filteredJobs = data.filter((item) => {
          // Filter out jobs based on their type
          if (Array.isArray(item.type)) {
            return !item.type.includes(1040);
          } else if (typeof item.type === "number") {
            return item.type !== 1040;
          } else if (typeof item.type === "string") {
            return !item.type.split(",").map(Number).includes(1040);
          }
          console.warn("Unexpected type format:", item.type);
          return false; // Default return if the format is unexpected
        });

        setJobsLocal(filteredJobs); // Update local jobs state
        setJobs(filteredJobs); // Update global jobs state through props
      } catch (err) {
        setError(err.message); // Set error state if fetching fails
      } finally {
        setLoading(false); // Always unset loading state
      }
    };

    loadJobs(); // Load jobs on component mount and page change
  }, [page, setJobs]);

  // Filter jobs based on the search query
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show loader if fetching for the first page
  if (loading && page === 1) return <Loader />;
  if (error) return <p>Error: {error}</p>; // Show error message

  return (
    <div className="pb-20  lg:p-10 p-5 w-auto bg-gradient-to-r from-gray-100 to-gray-300">
      <h1 className="text-2xl font-semibold pb-4">Jobs</h1>

      {/* Search Input */}
      <div className="relative mb-4">
        <MdSearch className="absolute left-3 top-3 text-gray-400 text-xl" />
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition duration-200 ease-in-out"
        />
      </div>

      <div className="flex gap-3 flex-wrap">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <p>No jobs found for "{searchQuery}"</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center items-center space-x-5 pb-[50px]">
        {/* Previous Page Button */}
        <button
          onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
          disabled={page <= 1}
          className={`flex items-center justify-center border rounded-full py-2 px-4 shadow-lg  ${
            page <= 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
          aria-label="Previous page"
        >
          <HiChevronLeft className="mr-2" />
          Previous
        </button>

        {/* Page Number Buttons */}
        {[1, 2, 3].map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => setPage(pageNumber)}
            disabled={page === pageNumber}
            className={`border hidden sm:block rounded-full py-2 px-4  ${
              page === pageNumber
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white"
            } ${page !== pageNumber ? "hover:bg-blue-100" : ""}`}
            aria-current={page === pageNumber ? "page" : undefined}
          >
            {pageNumber}
          </button>
        ))}

        {/* Next Page Button */}
        <button
          onClick={() =>
            setPage((prevPage) => Math.min(prevPage + 1, totalPages))
          }
          disabled={page >= totalPages}
          className={`flex items-center justify-center border rounded-full py-2 px-4 shadow-lg  ${
            page >= totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
          aria-label="Next page"
        >
          Next
          <HiChevronRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default JobsScreen;
