export interface IElectronAPI {
  openFile: () => Promise<string | null>;
  saveFile: (content: string) => Promise<string | null>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
