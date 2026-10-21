export type FileLanguage = 
  | 'typescript' 
  | 'javascript' 
  | 'html' 
  | 'css' 
  | 'json' 
  | 'markdown' 
  | 'env';

export interface VirtualFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: FileLanguage;
  isFolder: boolean;
  parentId: string | null;
  isModified?: boolean;
  isReadOnly?: boolean;
}

export interface ConsoleEntry {
  id: string;
  level: 'log' | 'info' | 'warn' | 'error';
  text: string;
  timestamp: string;
  count?: number;
}

export type ViewportDevice = 'desktop' | 'tablet' | 'mobile';

export type LayoutMode = 'split' | 'editor-only' | 'preview-only';

export type ActiveSidebarTab = 'explorer' | 'search' | 'templates' | 'settings';

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  autoRun: boolean;
  showLineNumbers: boolean;
  autoIndent: boolean;
}
