import React, { useState, useEffect } from 'react';
import { Project, createProjectManager } from '../index';
import { ProjectCard } from './ProjectCard';

interface ProjectListProps {
  type?: 'app' | 'package' | 'all';
  searchQuery?: string;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  type = 'all',
  searchQuery = '',
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const manager = createProjectManager();
        let fetchedProjects: Project[];

        if (type === 'all') {
          fetchedProjects = await manager.loadProjects();
        } else {
          fetchedProjects = await manager.getProjectsByType(type);
        }

        if (searchQuery) {
          fetchedProjects = await manager.searchProjects(searchQuery);
        }

        setProjects(fetchedProjects);
      } catch (err) {
        setError('加载项目失败');
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [type, searchQuery]);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>错误: {error}</div>;
  }

  return (
    <div className="project-list">
      <h2>
        {type === 'all' ? '所有项目' : type === 'app' ? '应用项目' : '包项目'}
      </h2>
      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      {projects.length === 0 && (
        <div className="empty-state">没有找到项目</div>
      )}
    </div>
  );
};
