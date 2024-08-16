
import { Octokit } from 'octokit';

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

const octokit = new Octokit({
  auth: GITHUB_TOKEN
})

export async function fetchUser(username:string) {

    try {
      const response = await octokit.request('GET /users/{username}', {
        username: username,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
          'Authorization': `token ${GITHUB_TOKEN}`
        }
      });
  
      return response.data;
    } catch (error) {
      console.error(error);
    }
}

export async function fetchUserRepositories(username:string) {
    try {
      const response = await octokit.request('GET /users/{username}/repos?per_page=8', {
        username: username,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
          'Authorization': `token ${GITHUB_TOKEN}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
}

export async function fetchOrganizationRpositories(org:string) {
    try {
      const response = await octokit.request('GET /orgs/{org}/repos?per_page=8', {
        org: org,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
          'Authorization': `token ${GITHUB_TOKEN}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
}

export async function fetchUserGists(username:string) {
    try {
      const response = await octokit.request('GET /users/{username}/gists?per_page=4', {
        username: username,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
          'Authorization': `token ${GITHUB_TOKEN}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
}

export async function fetchCompany(name:string) {
    try {
      const response = await octokit.request('GET /orgs/{org}', {
        org: name,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
          'Authorization': `token ${GITHUB_TOKEN}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
}