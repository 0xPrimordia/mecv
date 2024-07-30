import axios from 'axios';

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

export interface File {
  name: string;
  path: string;
  content?: string;
  download_url?: string;
  encoding?: string;
}

const languageExtensions: { [key: string]: string[] } = {
  javascript: ['.js', '.jsx', '.ts', '.tsx'],
  python: ['.py'],
  java: ['.java'],
  csharp: ['.cs'],
  cpp: ['.cpp', '.hpp'],
  php: ['.php'],
  ruby: ['.rb'],
  go: ['.go'],
  swift: ['.swift'],
  kotlin: ['.kt'],
  solidity: ['.sol']
};

export async function fetchRepo(
  username: string,
  repository: string,
  listOnly: boolean = false,
  extensions?: string[]
): Promise<File[]> {
  try {
    const url = `https://api.github.com/repos/${username}/${repository}/contents/`;
    console.log(`Fetching from URL: ${url}`);
    const response = await axios.get(url, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!Array.isArray(response.data)) {
      console.error("Unexpected response data:", response.data);
      throw new Error("Unexpected response from GitHub API");
    }

    return fetchFiles(username, repository, '', listOnly, extensions);
  } catch (error: any) {
    console.error(`Error fetching repository: ${error.message}`);
    if (error.response) {
      console.error(`Response status: ${error.response.status}`);
      console.error(`Response data:`, error.response.data);
    }
    throw error;
  }
}

async function fetchFiles(
  username: string,
  repository: string,
  path: string,
  listOnly: boolean,
  extensions?: string[]
): Promise<File[]> {
  const url = `https://api.github.com/repos/${username}/${repository}/contents/${path}`;
  console.log(`Fetching URL: ${url}`);
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    let files: File[] = [];
    for (const item of response.data) {
      if (item.type === 'file' && (!extensions || extensions.some(ext => item.name.endsWith(ext)))) {
        if (listOnly) {
          files.push({ name: item.name, path: item.path });
        } else {
          const fileContent = await fetchFileContent(item);
          files.push({ name: item.name, content: fileContent, path: item.path });
        }
      } else if (item.type === 'dir') {
        const dirFiles = await fetchFiles(username, repository, item.path, listOnly, extensions);
        files = files.concat(dirFiles);
      }
    }
    return files;
  } catch (error: any) {
    console.error(`Error fetching files from ${url}: ${error.message}`);
    if ('response' in error && error.response) {
      const axiosError = error.response;
      console.error(`Response data: ${JSON.stringify(axiosError.data)}`);
      console.error(`Status code: ${axiosError.status}`);
      console.error(`Headers: ${JSON.stringify(axiosError.headers)}`);
    }
    throw error;
  }
}

async function fetchFileContent(file: File): Promise<string> {
  try {
    const response = await axios.get(file.download_url!);
    if (file.encoding === 'base64') {
      return Buffer.from(response.data, 'base64').toString('utf-8');
    } else {
      return response.data;
    }
  } catch (error: any) {
    console.error(`Error fetching file content from ${file.download_url}: ${error.message}`);
    if ('response' in error && error.response) {
      const axiosError = error.response;
      console.error(`Response data: ${JSON.stringify(axiosError.data)}`);
      console.error(`Status code: ${axiosError.status}`);
      console.error(`Headers: ${JSON.stringify(axiosError.headers)}`);
    }
    throw error;
  }
}