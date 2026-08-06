import React from 'react';
import {
  FolderFilled,
  FolderAddFilled,
  BinRecycleFullFilled,
  GlobeFilled,
  PhoneDesktopFilled,
  DocumentFilled,
  ImageFilled,
  FolderOpenFilled,
  AppFolderFilled,
  CodeFilled,
  SparkleCircleFilled,
} from '@fluentui/react-icons';

interface Win11IconProps {
  name: string;
  size?: number;
  className?: string;
}

export const Win11Icon: React.FC<Win11IconProps> = ({
  name,
  size = 48,
  className = '',
}) => {
  const normalized = name.toLowerCase();

  const iconStyle: React.CSSProperties = {
    width: size,
    height: size,
    flexShrink: 0,
  };

  const cls = `drop-shadow-md transition-transform ${className}`;

  // Recycle Bin
  if (normalized.includes('trash') || normalized.includes('recycle') || normalized.includes('bin')) {
    return <BinRecycleFullFilled style={iconStyle} className={cls} color="#29B6F6" />;
  }

  // Add Folder / New Folder
  if (normalized.includes('add folder') || normalized.includes('new folder')) {
    return <FolderAddFilled style={iconStyle} className={cls} color="#FDB44B" />;
  }

  // Web Applications / Projects
  if (
    normalized.includes('web app') ||
    normalized.includes('web application') ||
    normalized.includes('website') ||
    normalized.includes('browser') ||
    normalized.includes('projects')
  ) {
    return <GlobeFilled style={iconStyle} className={cls} color="#4FC3F7" />;
  }

  // Mobile Projects
  if (
    normalized.includes('mobile') ||
    normalized.includes('phone') ||
    normalized.includes('ios') ||
    normalized.includes('android')
  ) {
    return <PhoneDesktopFilled style={iconStyle} className={cls} color="#80DEEA" />;
  }

  // Documents & Bio / Resume / About / Contact
  if (
    normalized.includes('document') ||
    normalized.includes('bio') ||
    normalized.includes('about') ||
    normalized.includes('resume') ||
    normalized.includes('pdf') ||
    normalized.includes('contact')
  ) {
    return <DocumentFilled style={iconStyle} className={cls} color="#E0E0E0" />;
  }

  // Images & Assets / Media
  if (
    normalized.includes('image') ||
    normalized.includes('photo') ||
    normalized.includes('asset') ||
    normalized.includes('media')
  ) {
    return <ImageFilled style={iconStyle} className={cls} color="#A5D6A7" />;
  }

  // Code / Web Applications (generic code)
  if (normalized.includes('code') || normalized.includes('developer')) {
    return <CodeFilled style={iconStyle} className={cls} color="#90CAF9" />;
  }

  // UI/UX / Design / Concepts
  if (
    normalized.includes('ui') ||
    normalized.includes('ux') ||
    normalized.includes('design') ||
    normalized.includes('concept')
  ) {
    return <SparkleCircleFilled style={iconStyle} className={cls} color="#CE93D8" />;
  }

  // Default: generic folder (yellow, matches Win11)
  return <FolderFilled style={iconStyle} className={cls} color="#FDB44B" />;
};
