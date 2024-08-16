import { NextResponse } from 'next/server';
import { classifyRepo } from '../../utils/classifyRepo';
import { detectLanguages, languageExtensions } from '../../languages/detect';
import { Octokit } from 'octokit';
import axios from 'axios';

type LanguageKey = keyof typeof languageExtensions;

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

const octokit = new Octokit({
  auth: GITHUB_TOKEN
})

async function parseFiles(data:any, extensions:Array<string>|null, fetchContent:boolean) {
    let files:Array<any> = [];
    if (!Array.isArray(data)) {
        console.error('Unexpected response format from GitHub API');
        return [];
    }
    for (const item of data) {
        if (item.type === 'file' && (!extensions || extensions.some(ext => item.name.endsWith(ext)))) {
            if (fetchContent) {
                const fileContent = await fetchFileContent(item);
                files.push({ name: item.name, content: fileContent });
              } else {
                files.push({ name: item.name, path: item.path });
              }
        } else if (item.type === 'dir') {
              const dirFiles = await parseFiles(item.files, extensions, fetchContent);
              files = files.concat(dirFiles);
        }
    }
    return files;
}

async function fetchFileContent(file:any) {
    try {
      const response = await axios.get(file.download_url);
      if (file.encoding === 'base64') {
        return Buffer.from(response.data, 'base64').toString('utf-8');
      } else {
        return response.data;
      }
    } catch (error:any) {
      console.error(`Error fetching file content from ${file.download_url}:`, error.message);
      throw error;
    }
}

async function fetchRepo(owner: string, repo: string, extensions: Array<string> | null) {
    let files: Array<any> = [];
    try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/contents', {
            owner: owner,
            repo: repo,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        });
        const data = await response.data;
        
        
        if (!Array.isArray(data)) {
            console.error('Unexpected response format from GitHub API');
            return [];
        }
        
        files = await parseFiles(data, extensions, true);
       
    } catch (error: any) {
        console.error('Error in fetchRepo:', error.message);
        throw error;
    }
    return files;
}

export async function POST(req: Request) {
  const body = await req.json();
  const { owner, repo } = body;

  if (!owner || !repo) {
    return NextResponse.json({ error: 'Missing required parameters' });
  }

  try {
    const files = await fetchRepo(owner, repo, null);

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files found' });
    }
    console.log('Files:', files.map(f => f.name).join(', '));
    let languages = detectLanguages(files);
    console.log(`Detected languages: ${languages.join(', ')}`);

    if (languages.length === 0) {
      console.log('File extensions:', files.map(f => f.name.split('.').pop()).join(', '));
      return NextResponse.json({ error: 'Unable to detect language' });
    }

    const results = [];
    for (const lang of languages as LanguageKey[]) {
      const langFiles = await fetchRepo(owner, repo, languageExtensions[lang]);
      const { level, elements } = classifyRepo(lang, langFiles);
      results.push({ language: lang, classification: level, elements });
    }

    return NextResponse.json({ results });
  } catch (error:any) {
    console.error('Error during evaluation:', error.message);
    return NextResponse.json({ error: error.message });
  }
}