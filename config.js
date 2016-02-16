System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "typescript",

  paths: {
    "npm:*": "jspm_packages/npm/*",
    "github:*": "jspm_packages/github/*"
  },

  map: {
    "bootstrap": "github:twbs/bootstrap@3.3.6",
    "jquery": "github:components/jquery@2.1.4",
    "github:twbs/bootstrap@3.3.6": {
      "jquery": "github:components/jquery@2.1.4"
    }
  }
});
