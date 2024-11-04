export async function fetchUser(username: string) {
  try {
    const response = await fetch(`/api/github?action=user&param=${username}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`GitHub API Error: ${data.details || data.error}`);
    }
    
    return data;
  } catch (error) {
    console.error('Fetch user error:', error);
    throw error;
  }
}

export async function fetchUserRepositories(username: string) {
  try {
    const response = await fetch(`/api/github?action=repos&param=${username}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`GitHub API Error: ${data.details || data.error}`);
    }
    
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchOrganizationRpositories(org: string) {
  try {
    const response = await fetch(`/api/github?action=orgs&param=${org}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`GitHub API Error: ${data.details || data.error}`);
    }
    
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchUserGists(username: string) {
  try {
    const response = await fetch(`/api/github?action=gists&param=${username}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`GitHub API Error: ${data.details || data.error}`);
    }
    
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchCompany(name: string) {
  try {
    const response = await fetch(`/api/github?action=orgs&param=${name}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`GitHub API Error: ${data.details || data.error}`);
    }
    
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}