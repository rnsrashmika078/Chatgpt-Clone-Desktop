
export interface UserMessage {
  chatId: string;
  // messageId: string;
  // from: From;
  title?: string;
  user: string;
  ai: string;
  // message: string;
  time?: Date;
  loading?: boolean;
}
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  token: string;
  authenticated?: string;
}
export interface UpdateChat {
  chatId: string;
  title: string;
}
export interface Reply {
  error: boolean;
  message: string;
}
