// src/utils/colorUtils.ts
export function lightenColor(color: string, amount: number): string {
    return adjustColor(color, amount);
  }
  
  export function darkenColor(color: string, amount: number): string {
    return adjustColor(color, -amount);
  }
  
  function adjustColor(color: string, amount: number): string {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    let r = (num >> 16) + amount * 255;
    let g = ((num >> 8) & 0x00FF) + amount * 255;
    let b = (num & 0x0000FF) + amount * 255;
    
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }