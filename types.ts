export enum Subject {
  MATH = 'Matemáticas',
  PHYSICS = 'Física',
  CHEMISTRY = 'Química',
}

export enum AppMode {
  HOME = 'home',
  SOLVER = 'solver',
  THEORY = 'theory',
  GAME = 'game',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
}

export interface SubjectConfig {
  id: Subject;
  color: string;
  bgColor: string;
  icon: string;
  gradient: string;
}
