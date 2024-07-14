module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  transformIgnorePatterns: ["node_modules/(?!variables/.*)"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        babel: true,
        tsconfig: "tsconfig.json",
      },
    ],
  },
};
