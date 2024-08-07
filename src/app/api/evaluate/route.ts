import { classifyRepo } from '../../utils/classifyRepo';
import { detectLanguages, languageExtensions } from '../../languages/detect';
import axios from 'axios';

type LanguageKey = keyof typeof languageExtensions;

async function parseFiles(data:any, extensions:Array<string>|null, fetchContent:boolean) {
    let files:Array<any> = [];
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

export async function fetchRepo(owner:string, repo:string, extensions:Array<any>|null) {
    let files:Array<any> = [];
    try {
        const response = await fetch(`/api/github/?owner=${owner}&repo=${repo}&path=null`);
        const data = await response.json();
        console.log(data);
        files = await parseFiles(data, null, true);
    } catch (error) {
        console.error(error);
    }
    return files;
}

export default async function handler(req:any, res:any) {
  const { owner, repo, language } = req.query;

  if (!owner || !repo) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const files = await fetchRepo(owner, repo, null);

    console.log(`Fetched files: ${JSON.stringify(files, null, 2)}`);

    let languages = language ? [language] : detectLanguages(files);
    if (languages.length === 0) {
      return res.status(400).json({ error: 'Unable to detect language' });
    }

    const results = [];
    for (const lang of languages as LanguageKey[]) {
      const langFiles = await fetchRepo(owner, repo, languageExtensions[lang]);
      const { level, elements } = classifyRepo(lang, langFiles);
      results.push({ language: lang, classification: level, elements });
    }

    res.status(200).json({ results });
  } catch (error:any) {
    console.error('Error during evaluation:', error.message);
    res.status(500).json({ error: error.message });
  }
}