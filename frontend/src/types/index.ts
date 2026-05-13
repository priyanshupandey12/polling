export interface User {
  _id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface Poll {
  _id: string;
  title: string;
  desc?: string;
  isAnonymous: boolean;
  status: "active" | "closed" | "published";
  expiresAt: string;
  createdAt: string;
  creatorId: string;
}

export interface Question {
  _id: string;
  pollId: string;
  questionText: string;
  isRequired: boolean;
  options: string[];
  createdAt: string;
}

export interface Answer {
  questionId: string;
  selectedOption: string;
}

export interface QuestionSummary {
  questionId: string;
  questionText: string;
  isRequired: boolean;
  options: string[];
  totalAnswered: number;
  optionCounts: Record<string, number>;
}

export interface Analytics {
  pollId: string;
  title: string;
  status: string;
  totalResponses: number;
  participation: {
    authenticated: number;
    anonymous: number;
  };
  questions: QuestionSummary[];
}