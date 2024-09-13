import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "./components/Navbar";
import JobsScreen from "./screens/JobsScreen";
import BookmarksScreen from "./screens/BookmarksScreen";
import JobDetail from "./screens/JobDetail";
import "./index.css";

// Configure the Toast notifications using SweetAlert2
const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: "#333",
  color: "#fff",
});

// Main application component
const App = () => {
  // State to store bookmarked jobs, initialized from localStorage
  const [bookmarkedJobs, setBookmarkedJobs] = useState(() => {
    const savedJobs = localStorage.getItem("bookmarkedJobs");
    // If there are saved jobs, parse them; otherwise, return an empty array
    return savedJobs ? JSON.parse(savedJobs) : [];
  });

  // State to store all jobs
  const [jobs, setJobs] = useState([]);

  // Function to handle bookmarking a job
  const handleBookmark = (job) => {
    // Check if the job is already bookmarked
    if (!bookmarkedJobs.find((bkJob) => bkJob.id === job.id)) {
      // If not bookmarked, add to bookmarks
      const newBookmarks = [...bookmarkedJobs, job];
      setBookmarkedJobs(newBookmarks);
      localStorage.setItem("bookmarkedJobs", JSON.stringify(newBookmarks));

      // Show success notification
      Toast.fire({
        icon: "success",
        title: "Job bookmarked successfully!",
        background: "green",
        color: "white",
      });
    } else {
      // Show information notification if job is already bookmarked
      Toast.fire({
        icon: "info",
        title: "Job is already bookmarked.",
        background: "red",
        color: "white",
      });
    }
  };

  // Function to handle deleting a bookmarked job
  const handleDeleteBookmark = (jobId) => {
    // Filter out the job that needs to be deleted
    const updatedBookmarks = bookmarkedJobs.filter((job) => job.id !== jobId);
    setBookmarkedJobs(updatedBookmarks);
    localStorage.setItem("bookmarkedJobs", JSON.stringify(updatedBookmarks));

    // Show success notification
    Toast.fire({
      icon: "success",
      title: "Bookmark removed successfully!",
      background: "green",
      color: "white",
    });
  };

  return (
    <Router>
      {/* Render the navigation bar */}
      <Navbar />
      <Routes>
        {/* Route for the jobs screen */}
        <Route
          path="/"
          element={<JobsScreen onBookmark={handleBookmark} setJobs={setJobs} />}
        />
        {/* Route for the bookmarks screen */}
        <Route
          path="/bookmarks"
          element={
            <BookmarksScreen
              bookmarkedJobs={bookmarkedJobs}
              onDelete={handleDeleteBookmark}
            />
          }
        />
        {/* Route for job detail screen */}
        <Route
          path="/jobs/:jobId"
          element={<JobDetail jobs={jobs} onBookmark={handleBookmark} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
