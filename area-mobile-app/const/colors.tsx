// const SUN_FLOWER = '#f1c40f';
// const ASBESTOS = '#7f8c8d';
// const MIDNIGHT_BLUE = '#2c3e50';
// const EMERALD = '#2ecc71';
// const ALIZARIN = '#e74c3c';
// const CLOUDS = '#ecf0f1';
// const SILVER = '#bdc3c7';

// const color = {
//     primary : "#27917E",
//     secondary : "#D7F4EF",
//     black : "#071C18",
//     white : "#FBFEFD",
//   }

// const light = {
//     ...color,
//     BACKGROUND: CLOUDS,
//     TEXT: MIDNIGHT_BLUE,
//     TEXT_SECONDARY: ASBESTOS,
//   };

// const dark = {
//     ...color,
//     BACKGROUND: MIDNIGHT_BLUE,
//     TEXT: CLOUDS,
//     TEXT_SECONDARY: SILVER,
//   };

//   export const colors = {light, dark};


const SUN_FLOWER: string = '#f1c40f';
const ASBESTOS: string = '#7f8c8d';
const MIDNIGHT_BLUE: string = '#2c3e50';
const EMERALD: string = '#2ecc71';
const ALIZARIN: string = '#e74c3c';
const CLOUDS: string = '#ecf0f1';
const SILVER: string = '#bdc3c7';

const common = {
 PRIMARY: SUN_FLOWER,
 SUCCESS: EMERALD,
 ERROR: ALIZARIN,
};

const light = {
 ...common,
 BACKGROUND: CLOUDS,
 TEXT: MIDNIGHT_BLUE,
 TEXT_SECONDARY: ASBESTOS,
};

const dark = {
 ...common,
 BACKGROUND: MIDNIGHT_BLUE,
 TEXT: CLOUDS,
 TEXT_SECONDARY: SILVER,
};

export const colors = {light, dark};