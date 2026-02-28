export interface Project {
  title: string;
  summary: string;
  stack: string[];
  repoUrl?: string;
  demoUrl?: string;
}

export const projects: Project[] = [
  {
    title: "Personal Portfolio Refresh",
    summary: "A modernized personal website built with Astro and Bootstrap 5.",
    stack: ["Astro", "Bootstrap 5", "GitHub Pages"],
    repoUrl: "https://github.com/Manask322/Manask322.github.io"
  },
  {
    title: "Machine Learning Experiments",
    summary: "A collection of practical ML notebooks and model experiments.",
    stack: ["Python", "scikit-learn", "Jupyter"],
    repoUrl: "https://github.com/Manask322"
  },
  {
    title: "Automation Utilities",
    summary: "Small scripts and tools that automate repetitive development tasks.",
    stack: ["Python", "Shell", "CI/CD"],
    repoUrl: "https://github.com/Manask322"
  }
];
