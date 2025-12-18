# Festival & Season Decorations System

This website now supports festive decorations AND seasonal themes that can be controlled independently!

## How to Change Festival or Season

Edit `/src/data/festival.json` and change the values:

```json
{
  "currentFestival": "christmas",
  "currentSeason": "winter"
}
```

You can set festivals and seasons separately or together!

## 🎉 Available Festivals

### 🎄 Christmas
- **Value**: `"christmas"`
- **Decoration**: Christmas tree emoji
- **Animation**: Wiggling
- **Snow Effect**: ✅ Enabled
- **Period**: December 1-31

### 🎊 New Year
- **Value**: `"newyear"`
- **Decoration**: Party popper emoji
- **Animation**: Party pop
- **Snow Effect**: ✅ Enabled
- **Period**: January 1-7

### 💝 Valentine's Day
- **Value**: `"valentines"`
- **Decoration**: Heart emoji
- **Animation**: Heart beat
- **Period**: February 10-14

### 🎨 Holi
- **Value**: `"holi"`
- **Decoration**: Paint palette emoji
- **Animation**: Color splash
- **Period**: March 1-15

### 🐰 Easter
- **Value**: `"easter"`
- **Decoration**: Bunny emoji
- **Animation**: Bunny hop
- **Period**: March 20 - April 20

### 🌙 Eid
- **Value**: `"eid"`
- **Decoration**: Moon emoji
- **Animation**: Moon glow
- **Period**: April 1-15

### 🇮🇳 Independence Day
- **Value**: `"independenceday"`
- **Decoration**: Indian flag emoji
- **Animation**: Flag wave
- **Period**: August 10-15

### 🐘 Ganesh Chaturthi
- **Value**: `"ganeshchaturthi"`
- **Decoration**: Elephant emoji
- **Animation**: Gentle sway
- **Period**: August 20 - September 10

### 🎃 Halloween
- **Value**: `"halloween"`
- **Decoration**: Pumpkin emoji
- **Animation**: Spooky shake
- **Period**: October 25-31

### 🪔 Diwali
- **Value**: `"diwali"`
- **Decoration**: Diya lamp emoji
- **Animation**: Diya glow
- **Period**: October 15 - November 15

### 🦃 Thanksgiving
- **Value**: `"thanksgiving"`
- **Decoration**: Turkey emoji
- **Animation**: Turkey strut
- **Period**: November 20-30

## 🌍 Available Seasons

### ❄️ Winter
- **Value**: `"winter"`
- **Decoration**: Snowflake emoji
- **Animation**: Winter sparkle
- **Snow Effect**: ✅ Enabled
- **Period**: December 1 - February 28

### 🌸 Spring
- **Value**: `"spring"`
- **Decoration**: Cherry blossom emoji
- **Animation**: Spring bloom
- **Period**: March 1 - May 31

### ☀️ Summer
- **Value**: `"summer"`
- **Decoration**: Sun emoji
- **Animation**: Summer shine
- **Period**: June 1 - August 31

### 🌧️ Monsoon
- **Value**: `"monsoon"`
- **Decoration**: Rain cloud emoji
- **Animation**: Rain drop
- **Period**: June 15 - September 30

### 🍂 Autumn
- **Value**: `"autumn"`
- **Decoration**: Fallen leaf emoji
- **Animation**: Leaf fall
- **Period**: September 1 - November 30

## 💡 Usage Examples

### Festival Only
```json
{
  "currentFestival": "diwali",
  "currentSeason": "none"
}
```
Result: Only Diwali diya lamp appears

### Season Only
```json
{
  "currentFestival": "none",
  "currentSeason": "summer"
}
```
Result: Only summer sun appears

### Both Festival and Season
```json
{
  "currentFestival": "christmas",
  "currentSeason": "winter"
}
```
Result: Both Christmas tree 🎄 and snowflake ❄️ appear with snow effect

### No Decorations
```json
{
  "currentFestival": "none",
  "currentSeason": "none"
}
```
Result: Clean, minimal look with no decorations

## Features

- **Independent Control**: Festivals and seasons are managed separately
- **Unique Animations**: Each festival and season has its own animation style
- **Snow Effect**: Enabled for Christmas, New Year, and Winter season
- **Accessibility**: Respects `prefers-reduced-motion` setting
- **Flexible**: Can show festival only, season only, both, or neither

## Adding New Items

### New Festival
1. Add to `festivals` in `/src/data/festival.json`
2. Add type to `FestivalType` in `/src/components/FestiveDecoration.astro`
3. Optionally add custom animation CSS

### New Season
1. Add to `seasons` in `/src/data/festival.json`
2. Add type to `SeasonType` in `/src/components/SeasonDecoration.astro`
3. Optionally add custom animation CSS

Enjoy the festive vibes! 🎉
