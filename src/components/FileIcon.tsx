import React from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileCode, 
  FileText, 
  FileJson, 
  FileSpreadsheet, 
  Settings2,
  File
} from 'lucide-react';
import { FileLanguage } from '../types';

interface FileIconProps {
  language?: FileLanguage;
  name: string;
  isFolder?: boolean;
  isOpen?: boolean;
  className?: string;
}

export function FileIcon({ language, name, isFolder, isOpen, className = 'w-4 h-4' }: FileIconProps) {
  if (isFolder) {
    return isOpen ? (
      <FolderOpen className={`${className} text-amber-400 shrink-0`} />
    ) : (
      <Folder className={`${className} text-amber-400 shrink-0`} />
    );
  }

  const ext = name.split('.').pop()?.toLowerCase();

  if (name.startsWith('.env')) {
    return <Settings2 className={`${className} text-yellow-400 shrink-0`} />;
  }

  switch (ext) {
    case 'tsx':
    case 'jsx':
      return <FileCode className={`${className} text-cyan-400 shrink-0`} />;
    case 'ts':
    case 'js':
      return <FileCode className={`${className} text-blue-400 shrink-0`} />;
    case 'html':
      return <FileCode className={`${className} text-orange-400 shrink-0`} />;
    case 'css':
      return <FileSpreadsheet className={`${className} text-indigo-400 shrink-0`} />;
    case 'json':
      return <FileJson className={`${className} text-amber-300 shrink-0`} />;
    case 'md':
      return <FileText className={`${className} text-zinc-400 shrink-0`} />;
    default:
      return <File className={`${className} text-zinc-400 shrink-0`} />;
  }
}
