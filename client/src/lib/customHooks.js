import {
  createJobMutation,
  getCompanyQuery,
  getJobsQuery,
  jobByIdQuery,
} from "../lib/graphql/queries";
import { useParams } from "react-router";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const useCompany = () => {
  const { companyId } = useParams();
  const { loading, error, data } = useQuery(getCompanyQuery, {
    variables: { id: companyId },
  });
  return { loading, error: Boolean(error), company: data?.company };
};

export default useCompany;

export const useJobs = (limit, offset) => {
  const { loading, error, data } = useQuery(getJobsQuery, {
    variables: { limit, offset },
    fetchPolicy: "network-only",
  });

  return { loading, error: Boolean(error), jobs: data?.jobs };
};

export const useJob = () => {
  const { jobId } = useParams();
  const { loading, error, data } = useQuery(jobByIdQuery, {
    variables: { id: jobId },
  });
  return { loading, error: Boolean(error), job: data?.job };
};

export const useCreateJob = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mutate, { error, loading }] = useMutation(createJobMutation);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // const job = await createJob({ title, description });
    const {
      data: { job },
    } = await mutate({
      variables: { input: { title, description } },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: jobByIdQuery,
          variables: { id: data.job.id },
          data,
        });
      },
    });
    if (job) {
      navigate(`/jobs/${job.id}`);
    }
  };
  return {
    description,
    error,
    handleSubmit,
    loading,
    setDescription,
    setTitle,
    title,
  };
};
