import { getCompany } from "./db/companies.js";
import {
  createJob,
  deleteJob,
  getCompanyJobs,
  getJob,
  getJobs,
  countJobs,
  updateJob,
} from "./db/jobs.js";

export const resolvers = {
  Query: {
    greeting: () => "hello world",
    jobs: async (_root, { limit, offset }) => {
      return {
        items: await getJobs(limit, offset),
        totalCount: await countJobs(),
      };
    },
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
    createJob: async (_root, { input: { title, description } }, { user }) => {
      if (!user) {
        notAuthorized("Missing authentication");
      }
      return createJob({ title, description, companyId: user.companyId });
    },
    deleteJob: async (_root, { id }, { user }) => {
      if (!user) {
        notAuthorized("Missing authentication");
      }
      const job = await deleteJob(id, user.companyId);
      if (!job) {
        notFoundError("No job found with id:" + id);
      }
      return job;
    },
    updateJob: (_root, { input }, { user }) => {
      if (!user) {
        notAuthorized("Missing authentication");
      }

      updateJob(input);
    },
  },

  Job: {
    // company: (job) => getCompany(job.companyId),
    company: (job, _args, { companyLoader }) => {
      return companyLoader.load(job.companyId);
    },
    date: (job) => toISODate(job.createdAt),
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

function notAuthorized(message) {
  throw new GraphQLError(message, {
    extensions: {
      code: "NOT_AUTHORIZED",
    },
  });
}
