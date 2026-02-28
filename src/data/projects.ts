export interface Project {
  title: string;
  summary: string;
  stack: string[];
  repoUrl?: string;
  demoUrl?: string;
}

export const projects: Project[] = [];
