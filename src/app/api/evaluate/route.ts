export async function GET(req:any, { params }:{params:any;}) {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const path = searchParams.get('path');

    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
            },
        });
        const data = await response.json();
        return Response.json(data)
    } catch (error) {   
        return new Response(`Error: ${error}`, { status: 500 });
    }
}