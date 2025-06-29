// lib/githubExtractor.ts
import { Octokit } from '@octokit/rest';
import path from 'path';

export interface RepoContent {
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string;
  children?: RepoContent[];
}

export interface RepositoryData {
  url: string;
  name: string;
  default_branch: string;
  stars: number;
  forks: number;
  last_updated: string;
  contents: RepoContent[];
}

export class GitHubCodeExtractor {
  private octokit: Octokit;
  private processedPaths: Set<string>;
  private debug: boolean;

  constructor(authToken: string = '') {
    this.octokit = new Octokit({
      auth: authToken
    });
    this.processedPaths = new Set();
    this.debug = false;
  }

  enableDebug(): void {
    this.debug = true;
  }

  private log(message: string, depth: number = 0): void {
    if (this.debug) {
      console.log('  '.repeat(depth) + message);
    }
  }

  private isBinaryFile(filePath: string): boolean {
    const binaryExtensions = [
      '.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx',
      '.xls', '.xlsx', '.zip', '.tar', '.gz', '.7z', '.exe',
      '.dll', '.so', '.dylib', '.class', '.jar', '.war'
    ];
    const ext = path.extname(filePath).toLowerCase();
    return binaryExtensions.includes(ext);
  }

  private parseGitHubUrl(url: string): { owner: string; repo: string } {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(regex);
    if (!match) throw new Error('Invalid GitHub URL');
    return {
      owner: match[1],
      repo: match[2].replace('.git', '')
    };
  }

  private async getFileContent(owner: string, repo: string, filePath: string): Promise<string> {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path: filePath
      });

      if ('content' in data) {
        if (this.isBinaryFile(filePath) || data.size > 1000000) {
          return `[Binary or large file: ${data.size} bytes]`;
        }
        return Buffer.from(data.content, 'base64').toString();
      }
      return '[No content available]';
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : String(error);
      return `[Error reading file: ${errorMessage}]`;
    }
  }

  private async getContents(
    owner: string,
    repo: string,
    currentPath: string = ''
  ): Promise<RepoContent[]> {
    if (this.processedPaths.has(currentPath)) {
      throw new Error(`Circular reference detected at ${currentPath}`);
    }
    this.processedPaths.add(currentPath);

    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path: currentPath
      });

      if (Array.isArray(data)) {
        const contents: RepoContent[] = [];
        for (const item of data) {
          if (item.type === 'dir') {
            const children = await this.getContents(owner, repo, item.path);
            contents.push({
              name: item.name,
              path: item.path,
              type: 'folder',
              children
            });
          } else if (item.type === 'file') {
            const content = await this.getFileContent(owner, repo, item.path);
            contents.push({
              name: item.name,
              path: item.path,
              type: 'file',
              content
            });
          }
        }
        return contents;
      } else {
        const content = await this.getFileContent(owner, repo, currentPath);
        return [{
          name: path.basename(currentPath),
          path: currentPath,
          type: 'file',
          content
        }];
      }
    } catch (error) {
      console.error(`Error processing path ${currentPath}:`, error);
      throw error;
    }
  }

  async extractRepositoryCode(repoUrl: string): Promise<RepositoryData> {
    try {
      const { owner, repo } = this.parseGitHubUrl(repoUrl);
      
      const { data: repoInfo } = await this.octokit.repos.get({
        owner,
        repo
      });

      const contents = await this.getContents(owner, repo);
      
      return {
        url: repoUrl,
        name: repoInfo.name,
        default_branch: repoInfo.default_branch,
        stars: repoInfo.stargazers_count,
        forks: repoInfo.forks_count,
        last_updated: repoInfo.updated_at,
        contents
      };
    } finally {
      this.processedPaths.clear();
    }
  }
}