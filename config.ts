import package_json from "./package.json" with { type: "json" };

export const APP_NAME = "My Sveltron App";
export const APP_PACKAGE = package_json.name;
export const APP_PROTOCOL = APP_PACKAGE.split(".")[2];
export const APP_VERSION = package_json.version;
