export {};

declare global {
    interface Window {
        electronAPI: {
            getMetadata: (filePath: string) => Promise<any>;
        };
    }
}
