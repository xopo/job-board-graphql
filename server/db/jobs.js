import { connection } from "./connection.js";
import { generateId } from "./ids.js";

const getJobTable = () => connection.table("job");

export async function getJobs(limit, offset) {
  const query = getJobTable().select().orderBy("createdAt", "desc");

  if (limit) {
    query.limit(limit);
  }
  if (offset) {
    query.offset(offset);
  }
  return await query;
}

export async function getCompanyJobs(companyId) {
  const query = getJobTable().where("companyId", companyId).select();
  return await query;
}

export async function getJob(id) {
  return await getJobTable().first().where({ id });
}

export async function createJob({ companyId, title, description }) {
  const job = {
    id: generateId(),
    companyId,
    title,
    description,
    createdAt: new Date().toISOString(),
  };
  await getJobTable().insert(job);
  return job;
}

export async function deleteJob(id, companyId) {
  const job = await getJobTable().first().where({ id, companyId });
  if (!job) {
    // throw new Error(`Job not found: ${id}`);
    return null;
  }
  await getJobTable().delete().where({ id });
  return job;
}

export async function countJobs() {
  const { count } = await getJobTable().count("* as count").first();
  return count;
}

export async function updateJob({ id, title, description, companyId }) {
  const job = await getJobTable().first().where({ id, companyId });
  if (!job) {
    throw new Error(`Job not found: ${id}`);
  }
  const updatedFields = { title, description };
  await getJobTable().update(updatedFields).where({ id });
  return { ...job, ...updatedFields };
}
