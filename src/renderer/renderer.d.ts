export interface IElectronAPI {
  openFile: () => Promise<{
    content: string;
    filePath: string;
    fileName: string;
  } | null>;
  saveFile: (content: string) => Promise<string | null>;
  writeFile: (filePath: string, content: string) => Promise<string>;
  confirmSaveBeforeNew: () => Promise<0 | 1 | 2>;
  onAttemptClose: (listener: () => void) => () => void;
  proceedClose: () => void;
  cancelClose: () => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
