import { AuthUser, Reply } from "./types/type";

export {};

declare global {
  interface Window {
    electronAPI: {
      getMetadata: (filePath: string) => Promise<any>;
    };
    chatgpt: {
      ask: (prompt: string) => Promise<Reply>;
    };
    auth: {
      setAuthUser: (AuthUser: AuthUser) => void;
      getAuthUser: () => Promise<AuthUser>;
    };
  }
}
