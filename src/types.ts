interface ExtraInfo {
  summary: string,
  releaseData: number,
  ratings: number
}

export interface AppSettings {
  wineVersion: WineProps;
  winePrefix: string;
  otherOptions: string;
  useGameMode: boolean;
  showFps: boolean;
  egsLinkedPath: string;
  defaultInstallPath: string;
}

export interface Game {
  art_cover: string,
  art_square: string,
  app_name: string, 
  executable: string, 
  title: string, 
  version: string, 
  save_path: string, 
  install_size: number, 
  extraInfo: ExtraInfo,
  install_path: string,
  developer: string,
  isInstalled: boolean
}

export interface Path {
  filePaths: string[];
}
export interface WineProps {
  name: string;
  bin: string;
}

export interface ContextType {
  user: string
  data: Game[]
  installing: string[]
  onlyInstalled: boolean
  playing: string[]
  refreshing: boolean
  error: boolean
  refresh: () => void
  refreshLibrary: () => void
  handleInstalling: (game: string) => void
  handlePlaying: (game: string) => void
  handleOnlyInstalled: () => void
  handleSearch: (input: string) => void
}