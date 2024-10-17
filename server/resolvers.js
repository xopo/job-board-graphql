import { GraphQLError } from "graphql";
import { getCompany } from "./db/companies.js";
import {
  createJob,
  deleteJob,
  getCompanyJobs,
  getJob,
  getJobs,
  updateJob,
} from "./db/jobs.js";

export const resolvers = {
  Query: {
    greeting: () => "hello world",
    jobs: () => getJobs(),
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        notFoundError("No job found with id " + id);
      }
      return job;
    },
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        notFoundError("No company found with id " + id);
      }
      return company;
    },
  },

  Mutation: {
    createJob: (_root, { input: { title, description } }) => {
      const companyId = "FjcJCHJALA4i"; // this will be update with authentication ( get id from auth )
      return createJob({ title, description, companyId });
    },
    deleteJob: (_root, { id }) => deleteJob(id),
    updateJob: (_root, { input }) => updateJob(input),
  },

  Job: {
    date: (job) => toISODate(job.createdAt),
    company: (job) => getCompany(job.companyId),
  },

  Company: {
    jobs: (company) => getCompanyJobs(company.id),
  },
};

const dateWidth = "yyyy-mm-dd".length;
function toISODate(value) {
  return value.slice(0, dateWidth);
}

function notFoundError(message) {
  throw new GraphQLError(message, {
    extensions: {
      code: "NOT_FOUND",
    },
  });
}
