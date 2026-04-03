import React from "react";

export const languages = [
  { code: 'en' as const, name: 'English', flag: (
    <svg className="w-5 h-auto rounded-sm" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="uk-s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
      <clipPath id="uk-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
      <g clipPath="url(#uk-s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-t)" stroke="#C8102E" strokeWidth="4"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
      </g>
    </svg>
  )},
  { code: 'de' as const, name: 'Deutsch', flag: (
    <svg className="w-5 h-auto rounded-sm" viewBox="0 0 60 36" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="12" fill="#000"/>
      <rect y="12" width="60" height="12" fill="#DD0000"/>
      <rect y="24" width="60" height="12" fill="#FFCE00"/>
    </svg>
  )},
  { code: 'ae' as const, name: 'UAE', flag: (
    <svg className="w-5 h-auto rounded-sm" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="10" fill="#00732F"/>
      <rect y="10" width="60" height="10" fill="#FFFFFF"/>
      <rect y="20" width="60" height="10" fill="#000000"/>
      <rect width="15" height="30" fill="#FF0000"/>
    </svg>
  )},
  { code: 'fr' as const, name: 'Français', flag: (
    <svg className="w-5 h-auto rounded-sm" viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="40" fill="#002395"/>
      <rect x="20" width="20" height="40" fill="#FFFFFF"/>
      <rect x="40" width="20" height="40" fill="#ED2939"/>
    </svg>
  )},
  { code: 'sg' as const, name: 'Singapore', flag: (
    <svg className="w-5 h-auto rounded-sm" viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="20" fill="#ED2939"/>
      <rect y="20" width="60" height="20" fill="#FFFFFF"/>
      <path d="M12,10 a6,6 0 1,1 0.01,0" fill="#FFFFFF"/>
      <path d="M14,10 a4,4 0 1,0 0.01,0" fill="#ED2939"/>
      <g fill="#FFFFFF" transform="translate(18,6)">
        <polygon points="0,3 1,0 2,3 -1,1.2 3,1.2" transform="scale(0.8)"/>
        <polygon points="0,3 1,0 2,3 -1,1.2 3,1.2" transform="translate(4,0) scale(0.8)"/>
        <polygon points="0,3 1,0 2,3 -1,1.2 3,1.2" transform="translate(6,2) scale(0.8)"/>
        <polygon points="0,3 1,0 2,3 -1,1.2 3,1.2" transform="translate(4,4) scale(0.8)"/>
        <polygon points="0,3 1,0 2,3 -1,1.2 3,1.2" transform="translate(0,4) scale(0.8)"/>
      </g>
    </svg>
  )},
  { code: 'au' as const, name: 'Australia', flag: (
    <svg className="w-5 h-auto rounded-sm" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="30" fill="#00008B"/>
      <g transform="scale(0.5)">
        <clipPath id="au-s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
        <clipPath id="au-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
        <g clipPath="url(#au-s)">
          <path d="M0,0 v30 h60 v-30 z" fill="#00008B"/>
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
          <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#au-t)" stroke="#C8102E" strokeWidth="4"/>
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
        </g>
      </g>
      <g fill="#FFFFFF">
        <polygon points="45,22 46,19 47,22 44,20 48,20" transform="scale(0.7)"/>
        <polygon points="52,10 53,7 54,10 51,8 55,8" transform="scale(0.7)"/>
        <polygon points="56,16 57,13 58,16 55,14 59,14" transform="scale(0.7)"/>
        <polygon points="52,24 53,21 54,24 51,22 55,22" transform="scale(0.7)"/>
        <polygon points="48,18 49,15 50,18 47,16 51,16" transform="scale(0.7)"/>
      </g>
    </svg>
  )},
  { code: 'nz' as const, name: 'New Zealand', flag: (
    <svg className="w-5 h-auto rounded-sm" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="30" fill="#00247D"/>
      <g transform="scale(0.5)">
        <clipPath id="nz-s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
        <clipPath id="nz-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
        <g clipPath="url(#nz-s)">
          <path d="M0,0 v30 h60 v-30 z" fill="#00247D"/>
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
          <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#nz-t)" stroke="#C8102E" strokeWidth="4"/>
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
        </g>
      </g>
      <g fill="#C8102E" stroke="#FFFFFF" strokeWidth="0.5">
        <polygon points="42,8 43,5 44,8 41,6 45,6"/>
        <polygon points="50,12 51,9 52,12 49,10 53,10"/>
        <polygon points="48,20 49,17 50,20 47,18 51,18"/>
        <polygon points="42,16 43,13 44,16 41,14 45,14"/>
      </g>
    </svg>
  )},
];
