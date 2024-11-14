"use client";
import { useState, useEffect } from 'react';
import { Button, Progress, Card, CardBody } from '@nextui-org/react';

export default function RepositoryAnalysis({ repositories }: { repositories: string[] }) {
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repositories })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      setAnalysisId(data.analysisId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (analysisId) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/analyze?analysisId=${analysisId}`);
          const status = await response.json();
          
          setStatus(status);
          
          // Stop polling when all jobs are complete
          if (status.completed + status.failed === status.total) {
            clearInterval(interval);
          }
        } catch (err: any) {
          setError(err.message);
          clearInterval(interval);
        }
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [analysisId]);

  return (
    <Card>
      <CardBody>
        <div className="space-y-4">
          <Button
            onClick={startAnalysis}
            disabled={loading || !!analysisId}
            color="primary"
          >
            Start Analysis
          </Button>

          {error && (
            <div className="text-red-500">
              Error: {error}
            </div>
          )}

          {status && (
            <div className="space-y-2">
              <Progress 
                value={(status.completed / status.total) * 100}
                className="w-full"
              />
              <div>
                Completed: {status.completed}/{status.total}
                {status.failed > 0 && ` (${status.failed} failed)`}
              </div>
              
              {status.results.map((result: any) => (
                <div key={result.repository}>
                  <h3 className="font-bold">{result.repository}</h3>
                  <pre className="bg-gray-100 p-2 rounded">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
} 