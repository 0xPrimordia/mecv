import { App } from 'octokit';

const GITHUB_ID = process.env.GITHUB_ID;
const GITHUB_PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY;
const INSTALLATION_ID = process.env.GITHUB_INSTALLATION_ID as unknown as number;

const app = new App({
  appId: GITHUB_ID!,
  privateKey: GITHUB_PRIVATE_KEY!,
});

async function getAuthenticatedOctokit() {
  return await app.getInstallationOctokit(INSTALLATION_ID!);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const param = searchParams.get('param');
  const code = searchParams.get('code');
  const installationId = searchParams.get('installation_id');

  console.log('Request received:', { action, param, code, installationId });
  
  // Handle GitHub App callback
  if (code && installationId) {
    try {
      console.log('Processing GitHub App callback...');
      // Store the installation ID or perform other setup tasks
      return Response.json({
        success: true,
        installation_id: installationId
      });
    } catch (error: any) {
      console.error('Callback processing error:', error);
      return Response.json({ 
        error: 'Failed to process callback',
        details: error.message 
      }, { status: 500 });
    }
  }

  console.log('Environment variables check:', {
    hasAppId: !!GITHUB_ID,
    hasPrivateKey: !!GITHUB_PRIVATE_KEY,
    hasInstallationId: !!INSTALLATION_ID,
    appId: GITHUB_ID,
    installationId: INSTALLATION_ID,
    // Don't log the actual private key, just its length
    privateKeyLength: GITHUB_PRIVATE_KEY?.length
  });

  if (!param) {
    return Response.json({ error: 'Parameter is required' }, { status: 400 });
  }

  try {
    console.log('Getting authenticated Octokit...');
    const octokit = await getAuthenticatedOctokit();
    console.log('Successfully got Octokit instance');
    
    let data;

    switch (action) {
      case 'user':
        console.log(`Fetching user data for: ${param}`);
        data = await octokit.request('GET /users/{username}', {
          username: param,
          headers: { 'X-GitHub-Api-Version': '2022-11-28' }
        });
        break;
      case 'repos':
        data = await octokit.request('GET /users/{username}/repos?per_page=8', {
          username: param,
          headers: { 'X-GitHub-Api-Version': '2022-11-28' }
        });
        break;
      // Add other cases as needed
      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    console.log('API request successful');
    return Response.json(data.data);
  } catch (error: any) {
    console.error('Detailed error:', {
      message: error.message,
      status: error.status,
      response: error.response?.data,
      stack: error.stack
    });
    
    // Return more specific error messages
    return Response.json({ 
      error: 'Failed to fetch data',
      details: error.message,
      status: error.status || 500
    }, { 
      status: error.status || 500 
    });
  }
}
