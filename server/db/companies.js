import DataLoader from "dataloader";
import { connection } from "./connection.js";

const getCompanyTable = () => connection.table("company");

export async function getCompany(id) {
  return await getCompanyTable().first().where({ id });
}
// make it for each request so that caching is not based on app process
// but on each request live
export function getCompanyLoader() {
  return new DataLoader(async (ids) => {
    const companies = await getCompanyTable().select().whereIn("id", ids);
    return ids.map((id) => companies.find((company) => company.id === id));
  });
}
