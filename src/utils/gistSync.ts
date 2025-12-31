// GitHub Gist sync utilities for cloud backup

const GIST_TOKEN_KEY = 'sidequest_gist_token';
const GIST_ID_KEY = 'sidequest_gist_id';
const GIST_FILENAME = 'sidequest_data.json';

export interface GistConfig {
  token: string;
  gistId?: string;
}

export interface SyncStatus {
  enabled: boolean;
  lastSynced?: string;
  error?: string;
}

// Get stored Gist configuration
export const getGistConfig = (): GistConfig | null => {
  const token = localStorage.getItem(GIST_TOKEN_KEY);
  const gistId = localStorage.getItem(GIST_ID_KEY);

  if (!token) return null;

  return { token, gistId: gistId || undefined };
};

// Save Gist configuration
export const saveGistConfig = (config: GistConfig): void => {
  localStorage.setItem(GIST_TOKEN_KEY, config.token);
  if (config.gistId) {
    localStorage.setItem(GIST_ID_KEY, config.gistId);
  }
};

// Clear Gist configuration
export const clearGistConfig = (): void => {
  localStorage.removeItem(GIST_TOKEN_KEY);
  localStorage.removeItem(GIST_ID_KEY);
};

// Create a new private Gist
const createGist = async (token: string, data: object): Promise<string> => {
  const response = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github+json',
    },
    body: JSON.stringify({
      description: 'SideQuest App Data Backup',
      public: false,
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(data, null, 2),
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create Gist');
  }

  const gist = await response.json();
  return gist.id;
};

// Update existing Gist
const updateGist = async (token: string, gistId: string, data: object): Promise<void> => {
  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github+json',
    },
    body: JSON.stringify({
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(data, null, 2),
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update Gist');
  }
};

// Fetch data from Gist
export const fetchFromGist = async (token: string, gistId: string): Promise<object | null> => {
  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // Gist not found
    }
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch Gist');
  }

  const gist = await response.json();
  const file = gist.files[GIST_FILENAME];

  if (!file) {
    return null;
  }

  return JSON.parse(file.content);
};

// Sync data to Gist (create if doesn't exist, update if does)
export const syncToGist = async (data: object): Promise<{ gistId: string; error?: string }> => {
  const config = getGistConfig();

  if (!config) {
    return { gistId: '', error: 'No Gist token configured' };
  }

  try {
    let gistId = config.gistId;

    if (gistId) {
      // Update existing Gist
      await updateGist(config.token, gistId, data);
    } else {
      // Create new Gist
      gistId = await createGist(config.token, data);
      saveGistConfig({ ...config, gistId });
    }

    return { gistId };
  } catch (error) {
    return {
      gistId: config.gistId || '',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Load data from Gist
export const loadFromGist = async (): Promise<{ data: object | null; error?: string }> => {
  const config = getGistConfig();

  if (!config || !config.gistId) {
    return { data: null, error: 'No Gist configured' };
  }

  try {
    const data = await fetchFromGist(config.token, config.gistId);
    return { data };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Validate token by attempting to fetch user info
export const validateToken = async (token: string): Promise<{ valid: boolean; username?: string; error?: string }> => {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
      },
    });

    if (!response.ok) {
      return { valid: false, error: 'Invalid token' };
    }

    const user = await response.json();
    return { valid: true, username: user.login };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Failed to validate token'
    };
  }
};

// Debounce utility for sync
export const createDebouncedSync = (delay: number = 3000) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (data: object, onSync: (result: { gistId: string; error?: string }) => void) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(async () => {
      const result = await syncToGist(data);
      onSync(result);
    }, delay);
  };
};
