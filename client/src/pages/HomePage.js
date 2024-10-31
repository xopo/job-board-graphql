import { useEffect, useState } from "react";
import JobList from "../components/JobList";
import { getJobs } from "../lib/graphql/queries";

function HomePage() {
  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList />
    </div>
  );
}

export default HomePage;
