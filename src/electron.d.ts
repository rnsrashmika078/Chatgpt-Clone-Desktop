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
    updater: {
      checkForUpdate: () => void; // triggers update check
      installUpdate: () => void; // triggers update installation
      onUpdateAvailable: (
        callback: (info: { version: string; releaseNotes?: string }) => void
      ) => void;
      onUpdateDownloaded: (callback: () => void) => void; // called when update downloaded
    };
  }
}
