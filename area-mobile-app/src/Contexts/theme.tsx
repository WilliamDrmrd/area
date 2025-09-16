// theme.js

export const servicesColors = {
  'text': '#071C18',
  'primary': '#27917E',
  'secondary': '#D7F4EF',
  'background': '#FBFEFD',
  'accent': '#27302D',
  'facebook': '#1877F2',
  'twitter': '#1DA1F2',
  'instagram': '#E4405F',
  'gmail': '#D44638',
  'github': '#181717',
  'stackoverflow': '#F48024',
  'weatherapi': '#1E90FF',
  'dayssincelastjavascriptframework': '#FDD835',
  'npmjs': '#CB3837',
  'discord': '#5865F2'
};

export const lightColors = {
  primary: '#27917E',
  background: '#FBFEFD',
  secondary: '#D7F4EF',
  error: '#F44336',
  white: '#FFFFFF',
  black: '#000000',
  accent: '#27302D',
  text: '#071C18',
  onPrimary: '#FBFEFD',
};

export const darkColors = {
  primary: '#6ed8c5',
  background: '#010403',
  secondary: '#0b2823',
  error: '#F44336',
  white: '#FFFFFF',
  black: '#000000',
  accent: '#cfd8d5',
  text: '#e2f8f4',
  onPrimary: '#010403',
};

export const lightTheme = {
  primary: '#27917E',
  background: '#FBFEFD',
  secondary: '#D7F4EF',
  error: '#F44336',
  white: '#FFFFFF',
  black: '#000000',
  accent: '#27302D',
  onPrimary: '#FBFEFD',
  container: {
    flex: 1,
    backgroundColor: lightColors.background,
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: lightColors.text,
  },
  title: {
    fontSize: 24,
    color: lightColors.text,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: lightColors.primary,
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: lightColors.white,
    fontSize: 16,
  },
  errorText: {
    color: lightColors.error,
    fontSize: 14,
  },
};

export const darkTheme = {
  primary: '#6ed8c5',
  background: '#010403',
  secondary: '#0b2823',
  error: '#F44336',
  white: '#FFFFFF',
  black: '#000000',
  accent: '#cfd8d5',
  onPrimary: '#010403',
  container: {
    flex: 1,
    backgroundColor: darkColors.background,
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: darkColors.text,
  },
  title: {
    fontSize: 24,
    color: darkColors.text,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: darkColors.primary,
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: darkColors.white,
    fontSize: 16,
  },
  errorText: {
    color: darkColors.error,
    fontSize: 14,
  },
};
