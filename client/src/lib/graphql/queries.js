import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient("http://localhost:9000/graphql");

export async function getCompany(id) {
  const query = gql`
    query getCompany($id: ID!) {
      company(id: $id) {
        id
        name
        description
      }
    }
  `;
  const { company } = await client.request(query, { id });
  return company;
}

export async function deleteJob(id) {
  const mutation = gql`
    mutation DeleteJob($id: ID!) {
      job: deleteJob(id: $id) {
        id
        title
      }
    }
  `;

  const { job } = client.query(mutation, { id });
  return job;
}

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        #here we use job: as alias for the result of createJob
        id
        date
        title
        company {
          id
          name
        }
      }
    }
  `;
  const { job } = await client.request(mutation, {
    input: { title, description },
  });
  return job;
}

export async function getJobs() {
  const query = gql`
    query {
      jobs {
        id
        date
        title
        company {
          id
          name
        }
      }
    }
  `;
  const { jobs } = await client.request(query);
  return jobs;
}

export async function getJob(id) {
  const query = gql`
    query JobById($id: ID!) {
      job(id: $id) {
        id
        date
        title
        description
        company {
          id
          name
        }
      }
    }
  `;

  const { job } = await client.request(query, { id });
  return job;
}
