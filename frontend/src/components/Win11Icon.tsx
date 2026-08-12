import React from 'react';
import folderIcon from '../assets/icons/folder.png';
import recycleBinIcon from '../assets/icons/recycle-bin.svg';
import documentIcon from '../assets/icons/document.svg';
import webIcon from '../assets/icons/web.svg';
import mobileIcon from '../assets/icons/mobile.svg';
import imagesIcon from '../assets/icons/images.svg';
import addFolderIcon from '../assets/icons/add-folder.svg';
import contactDetailsIcon from '../assets/icons/contact Details.png';
import cvIcon from '../assets/icons/cv.png';

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


  // 2. Add Folder / New Folder
  if (normalized.includes('add folder') || normalized.includes('new folder')) {
    return <img src={addFolderIcon} alt="Add Folder" style={iconStyle} className={cls} />;
  }

  // 3. Web Applications / Projects
  if (
    normalized.includes('web app') ||
    normalized.includes('web application') ||
    normalized.includes('website') ||
    normalized.includes('browser') ||
    normalized.includes('projects')
  ) {
    return <img src={folderIcon} alt="Folder" style={iconStyle} className={cls} />;
  }

  // 4. Mobile Projects
  if (
    normalized.includes('mobile') ||
    normalized.includes('phone') ||
    normalized.includes('ios') ||
    normalized.includes('android')
  ) {
    return <img src={mobileIcon} alt="Mobile Projects" style={iconStyle} className={cls} />;
  }

  // 5. Resume / CV
  if (normalized.includes('resume') || normalized.includes('cv')) {
    return <img src={cvIcon} alt="Resume" style={iconStyle} className={cls} />;
  }

  // 5b. Documents / Bio / PDF files
  if (
    normalized.includes('document') ||
    normalized.includes('bio') ||
    normalized.includes('pdf')
  ) {
    return <img src={documentIcon} alt="Document" style={iconStyle} className={cls} />;
  }

  // 6. Contact
  if (normalized.includes('contact')) {
    return <img src={contactDetailsIcon} alt="Contact" style={iconStyle} className={cls} />;
  }

  // 6b. About
  if (normalized.includes('about')) {
    return <img src={folderIcon} alt="Folder" style={iconStyle} className={cls} />;
  }

  // 7. Folders / UI/UX / Design / Concepts / Default
  return <img src={folderIcon} alt="Folder" style={iconStyle} className={cls} />;

};
