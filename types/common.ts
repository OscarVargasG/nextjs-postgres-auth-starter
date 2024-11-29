export interface Player {
  id: string; // Identificador único del jugador
  name: string; // Nombre del jugador
  score: number; // Puntuación del jugador
}

export interface UserWithQuiz {
  id: string;
  name: string;
  image: string | null;
  quizzes: string[]; // Lista de títulos de los quizzes asignados
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
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  url: string; // URL del quiz (nueva propiedad)
  createdAt: Date;
  userQuizzes: QuizUser[];
}

export interface AssignedQuiz {
  id: string;
  title: string;
  description: string;
  url: string; // La URL reemplaza a `link`
  score: number;
}
