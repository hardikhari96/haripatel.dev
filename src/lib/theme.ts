// Auto-detect current festival and season based on date
import themeConfig from '../data/theme.json';

type FestivalKey = keyof typeof themeConfig.festivals;
type SeasonKey = keyof typeof themeConfig.seasons;

interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

function isDateInRange(currentDate: Date, range: DateRange): boolean {
  if (!range.startDate || !range.endDate) return false;

  const [startMonth, startDay] = range.startDate.split('-').map(Number);
  const [endMonth, endDay] = range.endDate.split('-').map(Number);

  const currentMonth = currentDate.getMonth() + 1; // 0-indexed to 1-indexed
  const currentDay = currentDate.getDate();

  // Handle ranges within same year
  if (startMonth <= endMonth) {
    if (currentMonth < startMonth || currentMonth > endMonth) return false;
    if (currentMonth === startMonth && currentDay < startDay) return false;
    if (currentMonth === endMonth && currentDay > endDay) return false;
    return true;
  } 
  // Handle ranges that span year boundary (e.g., Dec-Feb for winter)
  else {
    if (currentMonth >= startMonth || currentMonth <= endMonth) {
      if (currentMonth === startMonth && currentDay < startDay) return false;
      if (currentMonth === endMonth && currentDay > endDay) return false;
      return true;
    }
    return false;
  }
}

export function getAutoFestival(): string {
  const now = new Date();
  
  // Check each festival to see if current date falls within its range
  for (const [key, festival] of Object.entries(themeConfig.festivals)) {
    if (key === 'none') continue;
    
    if (isDateInRange(now, festival as DateRange)) {
      return key;
    }
  }
  
  return 'none';
}

export function getAutoSeason(): string {
  const now = new Date();
  
  // Check each season to see if current date falls within its range
  for (const [key, season] of Object.entries(themeConfig.seasons)) {
    if (key === 'none') continue;
    
    if (isDateInRange(now, season as DateRange)) {
      return key;
    }
  }
  
  return 'none';
}

export function getCurrentTheme() {
  const festivalDisabled = themeConfig.enableFestivalEffects === false;
  const seasonDisabled = themeConfig.enableSeasonEffects === false;

  const festival = festivalDisabled
    ? 'none'
    : themeConfig.currentFestival === 'auto'
      ? getAutoFestival()
      : themeConfig.currentFestival;

  const season = seasonDisabled
    ? 'none'
    : themeConfig.currentSeason === 'auto'
      ? getAutoSeason()
      : themeConfig.currentSeason;

  return {
    festival,
    season,
    enableSnow: !seasonDisabled && (themeConfig.seasons[season as SeasonKey]?.enableSnow || false),
    enableRain: !seasonDisabled && season === 'monsoon',
    enableLeaves: !seasonDisabled && ['spring', 'autumn'].includes(season)
  };
}
