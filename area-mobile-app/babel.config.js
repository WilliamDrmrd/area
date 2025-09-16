module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        "module-resolver", {
          "root": ["./"],
          paths: {
            "@assets": "./assets",
            "@components": "./src/Components",
            "@services": "./src/Services",
            "@pages": "./src/Pages",
            "@utils": "./src/Utils",
            "@contexts": "./src/Contexts",
          },
          "alias": {
            "@assets": "./assets",
            "@components": "./src/Components",
            "@services": "./src/Services",
            "@pages": "./src/Pages",
            "@utils": "./src/Utils",
            "@contexts": "./src/Contexts",
          }
        },
      ]
    ]
  };
};
