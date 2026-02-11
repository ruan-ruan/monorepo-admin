import { Project, ProjectManagerConfig } from './types';

// 检测是否在浏览器环境中
const isBrowser = typeof window !== 'undefined';

// 项目管理器类
export class ProjectManager {
  private config: ProjectManagerConfig;
  private fs: any;
  private path: any;

  constructor(config: ProjectManagerConfig) {
    this.config = config;

    // 仅在非浏览器环境中加载 fs 和 path 模块
    if (!isBrowser) {
      this.fs = require('fs');
      this.path = require('path');
    }
  }

  // 加载所有项目
  async loadProjects(): Promise<Project[]> {
    // 在浏览器环境中，返回模拟数据
    if (isBrowser) {
      return this.getMockProjects();
    }

    const projects: Project[] = [];

    // 加载 packages 目录下的项目
    await this.loadProjectsFromDir(this.config.packagesDir, 'package', projects);

    // 加载 apps 目录下的项目
    await this.loadProjectsFromDir(this.config.appsDir, 'app', projects);

    return projects;
  }

  // 从指定目录加载项目
  private async loadProjectsFromDir(dirPath: string, type: 'app' | 'package', projects: Project[]): Promise<void> {
    if (isBrowser) {
      return;
    }

    const fullPath = this.path.join(this.config.rootDir, dirPath);

    if (!this.fs.existsSync(fullPath)) {
      return;
    }

    const entries = this.fs.readdirSync(fullPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const projectPath = this.path.join(fullPath, entry.name);
        const packageJsonPath = this.path.join(projectPath, 'package.json');

        if (this.fs.existsSync(packageJsonPath)) {
          try {
            const packageJson = JSON.parse(this.fs.readFileSync(packageJsonPath, 'utf-8'));
            projects.push({
              id: `${type}-${entry.name}`,
              name: packageJson.name || entry.name,
              path: this.path.relative(this.config.rootDir, projectPath),
              type,
              dependencies: packageJson.dependencies || {},
              devDependencies: packageJson.devDependencies || {},
              scripts: packageJson.scripts || {},
            });
          } catch (error) {
            console.error(`Error loading project ${entry.name}:`, error);
          }
        }
      }
    }
  }

  // 提供模拟数据（用于浏览器环境）
  private getMockProjects(): Project[] {
    return [
      {
        id: 'package-monorepo-manager',
        name: '@monorepo/manager',
        path: 'packages/monorepo-manager',
        type: 'package',
        dependencies: {
          'react': '^18.0.0',
          'react-dom': '^18.0.0'
        },
        devDependencies: {
          '@types/react': '^18.0.0',
          '@types/react-dom': '^18.0.0',
          'typescript': '^4.5.0',
          'rollup': '^2.60.0'
        },
        scripts: {
          'build': 'tsc && rollup -c',
          'dev': 'rollup -c -w',
          'test': 'jest'
        }
      },
      {
        id: 'app-demo-app',
        name: 'demo-app',
        path: 'apps/demo-app',
        type: 'app',
        dependencies: {
          'react': '^18.2.0',
          'react-dom': '^18.2.0',
          '@monorepo/manager': 'workspace:*'
        },
        devDependencies: {
          '@types/react': '^18.2.43',
          '@types/react-dom': '^18.2.17',
          '@vitejs/plugin-react': '^4.2.1',
          'vite': '^5.0.8'
        },
        scripts: {
          'dev': 'vite',
          'build': 'tsc && vite build',
          'lint': 'eslint . --ext ts,tsx',
          'preview': 'vite preview'
        }
      }
    ];
  }

  // 根据 ID 获取项目
  async getProjectById(id: string): Promise<Project | undefined> {
    const projects = await this.loadProjects();
    return projects.find(project => project.id === id);
  }

  // 根据类型获取项目
  async getProjectsByType(type: 'app' | 'package'): Promise<Project[]> {
    const projects = await this.loadProjects();
    return projects.filter(project => project.type === type);
  }

  // 搜索项目
  async searchProjects(query: string): Promise<Project[]> {
    const projects = await this.loadProjects();
    return projects.filter(project => 
      project.name.toLowerCase().includes(query.toLowerCase()) ||
      project.path.toLowerCase().includes(query.toLowerCase())
    );
  }
}

// 创建默认的项目管理器实例
export const createProjectManager = (config?: Partial<ProjectManagerConfig>): ProjectManager => {
  const defaultConfig: ProjectManagerConfig = {
    rootDir: typeof process !== 'undefined' ? process.cwd() : '/',
    packagesDir: 'packages',
    appsDir: 'apps',
    ...config,
  };

  return new ProjectManager(defaultConfig);
};
