export interface Player {
  id: string; // Identificador único del jugador
  name: string; // Nombre del jugador
  score: number; // Puntuación del jugador
}

export interface UserWithQuiz {
  id: string;
  name: string;
  image: string | null;
  quizzes: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export interface UserSession {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface QuizUser {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  score: number;
  link?: string | null; // Allow null for the link property
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  userQuizzes: QuizUser[];
}

export interface AssignedQuiz {
  id: string;
  title: string;
  description: string;
  score: number;
  link: string | null;
}
