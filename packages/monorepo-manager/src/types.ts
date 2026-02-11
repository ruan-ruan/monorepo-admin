// 项目类型定义
export interface Project {
  id: string;
  name: string;
  path: string;
  type: 'app' | 'package';
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
}

// 项目状态定义
export interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

// 项目管理配置定义
export interface ProjectManagerConfig {
  rootDir: string;
  packagesDir: string;
  appsDir: string;
}
