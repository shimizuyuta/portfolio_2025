// ポートフォリオの静的データ

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string;
  technologies: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "プロジェクト1",
    description: "プロジェクトの説明",
    image: "/images/project1.jpg",
    technologies: ["React", "TypeScript", "Next.js"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
];

export const experiences: Experience[] = [
  {
    id: "1",
    company: "会社名",
    position: "ポジション",
    period: "2023 - 現在",
    description: "経験の説明",
    technologies: ["React", "TypeScript", "Node.js"],
  },
];

export const services: Service[] = [
  {
    id: "1",
    title: "Web開発",
    description: "モダンなWebアプリケーションの開発",
    icon: "💻",
  },
];
