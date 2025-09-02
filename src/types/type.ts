type From = "user" | "ai";

export interface UserMessage {
  id: string;
  from: From;
  message: string;
  time: Date;
}
