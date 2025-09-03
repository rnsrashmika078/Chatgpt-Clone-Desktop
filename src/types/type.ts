type From = "user" | "ai";

export interface UserMessage {
  id: string;
  from: From;
  message: string;
  time?: Date;
  loading?: boolean;
}
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  token: string;
}
