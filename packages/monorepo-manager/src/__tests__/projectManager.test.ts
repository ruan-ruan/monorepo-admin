import { ProjectManager, createProjectManager } from '../projectManager';

// 模拟 fs 模块
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
}));

// 模拟 path 模块
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
  relative: jest.fn((from, to) => to.replace(from, '')),
}));

const fs = require('fs');
const path = require('path');

describe('ProjectManager', () => {
  let manager: ProjectManager;

  beforeEach(() => {
    manager = createProjectManager({ rootDir: '/test' });

    // 重置所有模拟
    jest.clearAllMocks();
  });

  describe('loadProjects', () => {
    it('should load projects from packages and apps directories', async () => {
      // 模拟 packages 目录存在且有一个项目
      fs.existsSync.mockImplementation((path: string) => {
        if (path === '/test/packages' || path === '/test/apps' || 
            path === '/test/packages/test-package/package.json' || 
            path === '/test/apps/test-app/package.json') {
          return true;
        }
        return false;
      });

      // 模拟 readdirSync 返回目录项
      fs.readdirSync.mockImplementation((dirPath: string, options: any) => {
        if (dirPath === '/test/packages') {
          return [{ isDirectory: () => true, name: 'test-package' }];
        }
        if (dirPath === '/test/apps') {
          return [{ isDirectory: () => true, name: 'test-app' }];
        }
        return [];
      });

      // 模拟 readFileSync 返回 package.json 内容
      fs.readFileSync.mockImplementation((filePath: string) => {
        if (filePath === '/test/packages/test-package/package.json') {
          return JSON.stringify({
            name: '@monorepo/test-package',
            dependencies: {},
            devDependencies: {},
            scripts: {},
          });
        }
        if (filePath === '/test/apps/test-app/package.json') {
          return JSON.stringify({
            name: 'test-app',
            dependencies: {},
            devDependencies: {},
            scripts: {},
          });
        }
        return '{}';
      });

      const projects = await manager.loadProjects();

      expect(projects).toHaveLength(2);
      expect(projects[0]).toEqual({
        id: 'package-test-package',
        name: '@monorepo/test-package',
        path: 'packages/test-package',
        type: 'package',
        dependencies: {},
        devDependencies: {},
        scripts: {},
      });
      expect(projects[1]).toEqual({
        id: 'app-test-app',
        name: 'test-app',
        path: 'apps/test-app',
        type: 'app',
        dependencies: {},
        devDependencies: {},
        scripts: {},
      });
    });

    it('should handle non-existent directories', async () => {
      // 模拟所有目录都不存在
      fs.existsSync.mockReturnValue(false);

      const projects = await manager.loadProjects();

      expect(projects).toHaveLength(0);
    });
  });

  describe('getProjectById', () => {
    it('should return project by id', async () => {
      // 模拟返回一个项目
      const mockProjects = [
        {
          id: 'package-test-package',
          name: '@monorepo/test-package',
          path: 'packages/test-package',
          type: 'package',
          dependencies: {},
          devDependencies: {},
          scripts: {},
        },
      ];

      // 模拟 loadProjects 方法
      jest.spyOn(manager as any, 'loadProjects').mockResolvedValue(mockProjects);

      const project = await manager.getProjectById('package-test-package');

      expect(project).toEqual(mockProjects[0]);
    });

    it('should return undefined for non-existent project', async () => {
      // 模拟返回空数组
      jest.spyOn(manager as any, 'loadProjects').mockResolvedValue([]);

      const project = await manager.getProjectById('non-existent');

      expect(project).toBeUndefined();
    });
  });

  describe('getProjectsByType', () => {
    it('should return projects by type', async () => {
      // 模拟返回多个项目
      const mockProjects = [
        {
          id: 'package-test-package',
          name: '@monorepo/test-package',
          path: 'packages/test-package',
          type: 'package',
          dependencies: {},
          devDependencies: {},
          scripts: {},
        },
        {
          id: 'app-test-app',
          name: 'test-app',
          path: 'apps/test-app',
          type: 'app',
          dependencies: {},
          devDependencies: {},
          scripts: {},
        },
      ];

      // 模拟 loadProjects 方法
      jest.spyOn(manager as any, 'loadProjects').mockResolvedValue(mockProjects);

      const packages = await manager.getProjectsByType('package');
      expect(packages).toHaveLength(1);
      expect(packages[0].type).toBe('package');

      const apps = await manager.getProjectsByType('app');
      expect(apps).toHaveLength(1);
      expect(apps[0].type).toBe('app');
    });
  });

  describe('searchProjects', () => {
    it('should search projects by query', async () => {
      // 模拟返回多个项目
      const mockProjects = [
        {
          id: 'package-test-package',
          name: '@monorepo/test-package',
          path: 'packages/test-package',
          type: 'package',
          dependencies: {},
          devDependencies: {},
          scripts: {},
        },
        {
          id: 'app-test-app',
          name: 'test-app',
          path: 'apps/test-app',
          type: 'app',
          dependencies: {},
          devDependencies: {},
          scripts: {},
        },
      ];

      // 模拟 loadProjects 方法
      jest.spyOn(manager as any, 'loadProjects').mockResolvedValue(mockProjects);

      const results = await manager.searchProjects('test');
      expect(results).toHaveLength(2);

      const packageResults = await manager.searchProjects('package');
      expect(packageResults).toHaveLength(1);
      expect(packageResults[0].id).toBe('package-test-package');
    });
  });
});

describe('createProjectManager', () => {
  it('should create a ProjectManager with default config', () => {
    const manager = createProjectManager();
    expect(manager).toBeInstanceOf(ProjectManager);
  });

  it('should create a ProjectManager with custom config', () => {
    const manager = createProjectManager({ rootDir: '/custom' });
    expect(manager).toBeInstanceOf(ProjectManager);
  });
});
