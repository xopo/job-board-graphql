import { Link } from "react-router-dom";
import { formatDate } from "../lib/formatters";
import { useJobs } from "../lib/customHooks";
import { useState } from "react";

const JOBS_PER_PAGE = 5;

function JobList() {
  const [current_page, setCurrentPage] = useState(0);
  const { loading, error, jobs: data } = useJobs(JOBS_PER_PAGE, current_page);
  const { items: jobs, totalCount } = data || { items: [], totalCount: 0 };
  if (loading) {
    return <div>Loading ...</div>;
  }
  if (error) {
    return <div>Error loading jobs</div>;
  }
  const totalPages = Math.floor(totalCount / JOBS_PER_PAGE);
  return (
    <>
      <div>
        <button
          type="button"
          disabled={current_page <= 0}
          onClick={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : 0))}
        >
          Previous
        </button>
        <span>
          page {current_page} of {totalPages}
        </span>
        <button
          type="button"
          disabled={current_page >= totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
      <ul className="box">
        {jobs.map((job) => (
          <JobItem key={job.id} job={job} />
        ))}
      </ul>
    </>
  );
}

function JobItem({ job }) {
  const title = job.company ? `${job.title} at ${job.company.name}` : job.title;
  return (
    <>
      <li className="media">
        <div className="media-left has-text-grey">{formatDate(job.date)}</div>
        <div className="media-content">
          <Link to={`/jobs/${job.id}`}>{title}</Link>
        </div>
      </li>
    </>
  );
}

export default JobList;
