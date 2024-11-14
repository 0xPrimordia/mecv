import { getQueue } from '@/utils/redis';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";

const analysisQueue = getQueue('git-analysis');

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      console.error('No session or user found');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { repositories } = await req.json();
    if (!repositories || !Array.isArray(repositories)) {
      console.error('Invalid repositories format:', repositories);
      return NextResponse.json({ error: 'Invalid repositories format' }, { status: 400 });
    }
    
    // Create a unique analysis ID
    const analysisId = `analysis-${Date.now()}`;
    console.log(`Starting analysis ${analysisId} for repositories:`, repositories);
    
    // Add each repository to the queue
    await Promise.all(repositories.map(async (repo: string) => {
      const [owner, repoName] = repo.split('/');
      console.log(`Queueing analysis for ${owner}/${repoName}`);
      
      try {
        await analysisQueue.add('analyze-repo', {
          owner,
          repo: repoName,
          analysisId,
          accessToken: session.accessToken
        });
      } catch (queueError) {
        console.error(`Queue error for ${owner}/${repoName}:`, queueError);
        throw queueError;
      }
    }));

    return NextResponse.json({ 
      success: true, 
      analysisId 
    });
  } catch (error) {
    console.error('Analysis queue error:', error);
    // Ensure we're returning a proper JSON response
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to start analysis' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const analysisId = searchParams.get('analysisId');

    if (!analysisId) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      );
    }

    console.log(`Fetching status for analysis ${analysisId}`);
    const jobs = await analysisQueue.getJobs();
    console.log(`Found ${jobs.length} total jobs`);
    
    const analysisJobs = jobs.filter((job: any) => 
      job.data.analysisId === analysisId
    );
    console.log(`Found ${analysisJobs.length} jobs for analysis ${analysisId}`);

    const status = {
      total: analysisJobs.length,
      completed: 0,
      failed: 0,
      pending: 0,
      results: [] as { repository: string; result: any }[]
    };

    for (const job of analysisJobs) {
      const state = await job.getState();
      console.log(`Job ${job.id} state:`, state);
      
      switch(state) {
        case 'completed':
          status.completed++;
          status.results.push({
            repository: `${job.data.owner}/${job.data.repo}`,
            result: job.returnvalue
          });
          break;
        case 'failed':
          status.failed++;
          break;
        default:
          status.pending++;
      }
    }

    return NextResponse.json(status);
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check status' },
      { status: 500 }
    );
  }
} 