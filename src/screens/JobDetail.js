import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

// Toast configuration using SweetAlert2 for notifications
const Toast = Swal.mixin({
  toast: true,
  position: "bottom-left",
  iconColor: "white",
  background: "green",
  color: "white",
  customClass: {
    popup: "colored-toast",
  },
  showConfirmButton: false,
  timerProgressBar: true,
});

const JobDetail = ({ jobs, onBookmark }) => {
  const { jobId } = useParams(); // Get job ID from URL parameters
  const [job, setJob] = useState(null); // State for job details
  const [error, setError] = useState(null); // State for error handling

  // Load job details based on job ID
  useEffect(() => {
    const loadJob = () => {
      // Try to find job in current jobs list
      let foundJob = jobs.find((job) => job.id === parseInt(jobId, 10));

      if (!foundJob) {
        // If not found, look in localStorage
        const savedJobs = localStorage.getItem("jobs");
        if (savedJobs) {
          const jobsArray = JSON.parse(savedJobs);
          foundJob = jobsArray.find((job) => job.id === parseInt(jobId, 10));
        }
      }

      // Set job if found, otherwise set error state
      if (foundJob) {
        setJob(foundJob);
      } else {
        setError("Job not found!");
      }
    };

    loadJob(); // Fetch the job when component mounts or jobId changes
  }, [jobId, jobs]);

  // Display error message if job not found
  if (error) return <p>{error}</p>;

  // Display loading message while job details are being fetched
  if (!job) return <p>Loading job details...</p>;

  // Determine the salary display
  const salary =
    job?.primary_details?.Salary === "-"
      ? "Based on Interview"
      : job?.primary_details?.Salary || "Not Available";

  return (
    <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-300 h-[120vh] flex flex-col gap-10 justify-start lg:pt-20 pt-10 items-center">
      <h1 className="text-3xl font-semibold">Job Details</h1>
      <div className="bg-white lg:w-[50%] rounded-lg p-5 flex flex-col justify-start gap-3">
        <h1 className="text-xl font-semibold py-4">{job.title}</h1>
        <p>{job.other_details}</p>
        <p className="font-semibold text-lg">
          Company Name: <span className="font-normal">{job.company_name}</span>
        </p>
        <p className="font-semibold text-lg">
          Job Role: <span className="font-normal">{job.job_role}</span>
        </p>
        <p className="font-semibold text-lg">
          Working Hours: <span className="font-normal">{job.job_hours}</span>
        </p>
        <p className="font-semibold text-lg">
          Location: <span className="font-normal">{job.job_location_slug}</span>
        </p>
        <p className="font-semibold text-lg">
          Salary: <span className="font-normal">{salary}</span>
        </p>
        <p className="font-semibold text-lg">
          Openings: <span className="font-normal">{job.openings_count}</span>
        </p>
        <p className="font-semibold text-lg">
          Experience:{" "}
          <span className="font-normal">{job.primary_details.Experience}</span>
        </p>
        <p className="font-semibold text-lg">
          Contact Number: <span className="font-normal">{job.whatsapp_no}</span>
        </p>

        {/* Button to bookmark job */}
        <button
          onClick={() => onBookmark(job)} // Call onBookmark with the job details
          className="mt-4 bg-blue-500 text-white p-2 rounded"
        >
          Bookmark This Job
        </button>
      </div>
    </div>
  );
};

export default JobDetail;
