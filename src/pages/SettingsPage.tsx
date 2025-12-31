import React, { useState, useEffect, useRef } from 'react';
import { useQuests } from '../contexts/QuestContext';
import {
  getGistConfig,
  saveGistConfig,
  clearGistConfig,
  validateToken,
  syncToGist,
  loadFromGist,
} from '../utils/gistSync';

export const SettingsPage: React.FC = () => {
  const { quests, questLines, dailyStats, userProgress, importData } = useQuests();

  // Gist sync state
  const [gistToken, setGistToken] = useState('');
  const [gistId, setGistId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Import/export state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');

  // Load existing config on mount
  useEffect(() => {
    const config = getGistConfig();
    if (config) {
      setGistToken(config.token);
      setGistId(config.gistId || '');
      setIsConnected(true);
      // Validate token to get username
      validateToken(config.token).then((result) => {
        if (result.valid && result.username) {
          setUsername(result.username);
        }
      });
    }
  }, []);

  // Connect to GitHub
  const handleConnect = async () => {
    if (!gistToken.trim()) {
      setSyncMessage('Please enter a token');
      setSyncStatus('error');
      return;
    }

    setIsValidating(true);
    setSyncStatus('idle');

    const result = await validateToken(gistToken.trim());

    if (result.valid) {
      saveGistConfig({ token: gistToken.trim(), gistId: gistId || undefined });
      setIsConnected(true);
      setUsername(result.username || '');
      setSyncMessage(`Connected as ${result.username}`);
      setSyncStatus('success');
    } else {
      setSyncMessage(result.error || 'Invalid token');
      setSyncStatus('error');
    }

    setIsValidating(false);
  };

  // Disconnect from GitHub
  const handleDisconnect = () => {
    clearGistConfig();
    setGistToken('');
    setGistId('');
    setIsConnected(false);
    setUsername('');
    setSyncStatus('idle');
    setSyncMessage('');
  };

  // Manual sync to Gist
  const handleSyncNow = async () => {
    setSyncStatus('syncing');
    setSyncMessage('Syncing...');

    const data = { quests, questLines, dailyStats, userProgress };
    const result = await syncToGist(data);

    if (result.error) {
      setSyncStatus('error');
      setSyncMessage(result.error);
    } else {
      setGistId(result.gistId);
      setSyncStatus('success');
      setSyncMessage('Synced successfully!');
    }
  };

  // Load from Gist
  const handleLoadFromGist = async () => {
    setSyncStatus('syncing');
    setSyncMessage('Loading from cloud...');

    const result = await loadFromGist();

    if (result.error) {
      setSyncStatus('error');
      setSyncMessage(result.error);
    } else if (result.data) {
      importData(result.data);
      setSyncStatus('success');
      setSyncMessage('Data loaded from cloud!');
    } else {
      setSyncStatus('error');
      setSyncMessage('No data found in cloud');
    }
  };

  // Export to JSON file
  const handleExport = () => {
    const data = { quests, questLines, dailyStats, userProgress };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sidequest_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import from JSON file
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        importData(data);
        setImportStatus('success');
        setImportMessage('Data imported successfully!');
      } catch {
        setImportStatus('error');
        setImportMessage('Failed to parse file. Is it a valid SideQuest backup?');
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Settings</h1>
          <p className="text-gray-400">Manage your data and cloud sync</p>
        </div>

        {/* Cloud Sync Section */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Cloud Sync</h2>
          <p className="text-gray-400 text-sm mb-4">
            Sync your data to a private GitHub Gist for automatic cloud backup.
          </p>

          {!isConnected ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  GitHub Personal Access Token
                </label>
                <input
                  type="password"
                  value={gistToken}
                  onChange={(e) => setGistToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Create a token at GitHub Settings → Developer settings → Personal access tokens → Tokens (classic).
                  Only needs "gist" scope.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Existing Gist ID (optional)
                </label>
                <input
                  type="text"
                  value={gistId}
                  onChange={(e) => setGistId(e.target.value)}
                  placeholder="Leave empty to create new"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  If you have an existing SideQuest Gist, paste its ID here to restore.
                </p>
              </div>

              <button
                onClick={handleConnect}
                disabled={isValidating}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {isValidating ? 'Validating...' : 'Connect to GitHub'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-dark-bg rounded-lg border border-dark-border">
                <div>
                  <p className="text-white font-medium">Connected as {username}</p>
                  <p className="text-xs text-gray-500">Gist ID: {gistId || 'Not created yet'}</p>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Disconnect
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSyncNow}
                  disabled={syncStatus === 'syncing'}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
                </button>
                <button
                  onClick={handleLoadFromGist}
                  disabled={syncStatus === 'syncing' || !gistId}
                  className="flex-1 bg-dark-bg hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg border border-dark-border transition-colors"
                >
                  Load from Cloud
                </button>
              </div>
            </div>
          )}

          {syncMessage && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm ${
                syncStatus === 'success'
                  ? 'bg-green-900/30 text-green-400 border border-green-700'
                  : syncStatus === 'error'
                  ? 'bg-red-900/30 text-red-400 border border-red-700'
                  : 'bg-dark-bg text-gray-400 border border-dark-border'
              }`}
            >
              {syncMessage}
            </div>
          )}
        </div>

        {/* Manual Import/Export Section */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Manual Backup</h2>
          <p className="text-gray-400 text-sm mb-4">
            Export your data as a JSON file or import from a previous backup.
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex-1 bg-dark-bg hover:bg-dark-border text-white font-semibold py-2 px-4 rounded-lg border border-dark-border transition-colors"
            >
              Export to File
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-dark-bg hover:bg-dark-border text-white font-semibold py-2 px-4 rounded-lg border border-dark-border transition-colors"
            >
              Import from File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>

          {importMessage && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm ${
                importStatus === 'success'
                  ? 'bg-green-900/30 text-green-400 border border-green-700'
                  : 'bg-red-900/30 text-red-400 border border-red-700'
              }`}
            >
              {importMessage}
            </div>
          )}
        </div>

        {/* Data Info */}
        <div className="mt-6 p-4 bg-dark-surface border border-dark-border rounded-xl">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Current Data</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{quests.length}</div>
              <div className="text-xs text-gray-500">Quests</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {quests.reduce((sum, q) => sum + q.tasks.length, 0)}
              </div>
              <div className="text-xs text-gray-500">Tasks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{userProgress.level}</div>
              <div className="text-xs text-gray-500">Level</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{userProgress.currentXP}</div>
              <div className="text-xs text-gray-500">XP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
