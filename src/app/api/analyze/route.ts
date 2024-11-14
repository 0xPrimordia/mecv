import { getQueue } from '@/utils/redis';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";

const analysisQueue = getQueue('git-analysis');

export async function POST(req: Request) {
  const session = await getServerSession();
  try {
    const { repositories } = await req.json();
    
    // Create a unique analysis ID
    const analysisId = `analysis-${Date.now()}`;
    
    // Add each repository to the queue
    await Promise.all(repositories.map(async (repo: string) => {
      const [owner, repoName] = repo.split('/');
      if (session?.user) {  // Check for authenticated user
        await analysisQueue.add('analyze-repo', {
          owner,
          repo: repoName,
          analysisId,
          accessToken: session.accessToken // This will be available if you've configured NextAuth correctly
        });
      }
    }));

    return NextResponse.json({ 
      success: true, 
      analysisId 
    });
  } catch (error) {
    console.error('Analysis queue error:', error);
    return NextResponse.json(
      { error: 'Failed to start analysis' },
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

    const jobs = await analysisQueue.getJobs();
    const analysisJobs = jobs.filter((job: any) => 
      job.data.analysisId === analysisId
    );

    const status = {
      total: analysisJobs.length,
      completed: 0,
      failed: 0,
      pending: 0,
      results: [] as { repository: string; result: any }[]
    };

    for (const job of analysisJobs) {
      const state = await job.getState();
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
      { error: 'Failed to check status' },
      { status: 500 }
    );
  }
} 