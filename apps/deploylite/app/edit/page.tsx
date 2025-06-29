"use client"

import { useState, useEffect } from 'react';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Define the RepoContent interface
interface RepoContent {
  type: 'file' | 'folder';
  name: string;
  path: string;
  content?: string;
  children?: RepoContent[];
}

// Define the RepoData interface
interface RepoData {
  name: string;
  stars: number;
  contents: RepoContent[];
}

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center bg-gray-100">
      <Loader2 className="animate-spin" />
    </div>
  ),
});

const RepoViewer = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [selectedFile, setSelectedFile] = useState<RepoContent | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState('');

  const getFileLanguage = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    
    const languageMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      cs: 'csharp',
      html: 'html',
      css: 'css',
      json: 'json',
      md: 'markdown',
      yml: 'yaml',
      yaml: 'yaml',
      xml: 'xml',
      sql: 'sql',
      sh: 'shell',
      bash: 'shell',
      php: 'php',
      go: 'go',
      rust: 'rust',
      rb: 'ruby',
      pl: 'perl',
      swift: 'swift',
      kt: 'kotlin',
      dart: 'dart',
    };
    
    // Type-safe indexing
    return ext in languageMap ? languageMap[ext] : 'plaintext';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSelectedFile(null);
    setSelectedFilePath('');

    try {
      const response = await fetch('/api/repo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl, authToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch repository data');
      }

      const data = await response.json();
      setRepoData(data);
    } catch (err) {
      // Type checking to safely access the message property
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderFileTree = (content: RepoContent) => {
    if (content.type === 'folder') {
      return (
        <div key={content.path} className="ml-4">
          <div className="font-medium text-blue-600 py-1 hover:bg-gray-100 rounded cursor-pointer">
            📁 {content.name}
          </div>
          <div className="ml-4">
            {content.children?.map(child => renderFileTree(child))}
          </div>
        </div>
      );
    } else {
      return (
        <div 
          key={content.path} 
          className={`ml-4 py-1 hover:bg-gray-100 rounded cursor-pointer ${
            selectedFilePath === content.path ? 'bg-blue-100' : ''
          }`}
          onClick={() => {
            setSelectedFile(content);
            setSelectedFilePath(content.path);
          }}
        >
          <div className="font-medium">
            📄 {content.name}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">
            GitHub Repository URL
          </label>
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="https://github.com/username/repo"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Auth Token (optional)
          </label>
          <input
            type="password"
            value={authToken}
            onChange={(e) => setAuthToken(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="github_pat_..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Loading...' : 'Extract Repository'}
        </button>
      </form>

      {error && (
        <div className="text-red-500 mb-4">
          Error: {error}
        </div>
      )}

      {repoData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* File Tree */}
          <div className="md:col-span-1 border rounded p-4 h-[calc(100vh-300px)] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {repoData.name} ({repoData.stars} ⭐)
            </h2>
            <div className="space-y-2">
              {repoData.contents.map(content => renderFileTree(content))}
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="md:col-span-3 border rounded">
            {selectedFile ? (
              <div className="h-[calc(100vh-300px)]">
                <div className="bg-gray-100 px-4 py-2 border-b">
                  {selectedFile.path}
                </div>
                <MonacoEditor
                  height="calc(100% - 40px)"
                  language={getFileLanguage(selectedFile.name)}
                  value={selectedFile.content}
                  theme="vs-light"
                  options={{
                    readOnly: true,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    wordWrap: 'on',
                    automaticLayout: true,
                  }}
                />
              </div>
            ) : (
              <div className="h-[calc(100vh-300px)] flex items-center justify-center text-gray-500">
                Select a file to view its contents
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RepoViewer;