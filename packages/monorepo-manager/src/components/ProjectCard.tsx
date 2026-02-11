import React from 'react';
import { Project } from '../index';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="project-card">
      <div className="project-header">
        <h3>{project.name}</h3>
        <span className={`project-type ${project.type}`}>
          {project.type === 'app' ? '应用' : '包'}
        </span>
      </div>
      <div className="project-info">
        <p className="project-path">路径: {project.path}</p>
        <div className="project-dependencies">
          <h4>依赖</h4>
          <ul>
            {Object.entries(project.dependencies).slice(0, 3).map(([name, version]) => (
              <li key={name}>{name}: {version}</li>
            ))}
            {Object.keys(project.dependencies).length > 3 && (
              <li>...</li>
            )}
          </ul>
        </div>
        <div className="project-scripts">
          <h4>脚本</h4>
          <ul>
            {Object.keys(project.scripts).slice(0, 3).map((script) => (
              <li key={script}>{script}</li>
            ))}
            {Object.keys(project.scripts).length > 3 && (
              <li>...</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
