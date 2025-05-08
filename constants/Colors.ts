/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, Nativewind, Tamagui, unistyles, etc.
 */

const tintColorLight = 'hsl(240 5.9% 10%)';  // votre "primary" clair
const tintColorDark = 'hsl(0 0% 98%)';       // votre "primary" foncé

export const Colors = {
  light: {
    text:      'hsl(240 10% 3.9%)',   // foreground
    background:'hsl(0 0% 100%)',      // background
    tint:       tintColorLight,       // accent / active icon
    icon:      'hsl(240 5.9% 90%)',   // border / inactive icon
    tabIconDefault:  'hsl(240 5.9% 90%)', // icône d’onglet inactif
    tabIconSelected: tintColorLight,      // icône d’onglet actif
  },
  dark: {
    text:      'hsl(0 0% 98%)',       // foreground
    background:'hsl(240 10% 3.9%)',   // background
    tint:       tintColorDark,        // accent / active icon
    icon:      'hsl(240 3.7% 15.9%)', // border / inactive icon
    tabIconDefault:  'hsl(240 3.7% 15.9%)', // icône d’onglet inactif
    tabIconSelected: tintColorDark,       // icône d’onglet actif
  },
};
