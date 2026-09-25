import package_json from "./package.json" with { type: "json" };

/**
 * CHANGE THE FOLLOWING CONSTANTS TO CUSTOMIZE YOUR APP
 * @constant APP_NAME - The name of your app, used in the build process and as the default window title.
 */
export const APP_NAME = "My Sveltron App";

/**
 * DO NOT CHANGE THE FOLLOWING CONSTANTS, THEY ARE USED IN THE BUILD PROCESS
 * and are automatically generated based on the package.json file.
 * @constant APP_PACKAGE - The package ID String of your app, used in the build process and as the default window title.
 * @constant APP_PROTOCOL - The protocol of your app, used for routing .
 * @constant APP_VERSION - The version of your app, used in the build process.
 */
export const APP_PACKAGE = package_json.name;
export const APP_PROTOCOL =
  APP_PACKAGE.split(".").length >= 3
    ? APP_PACKAGE.split(".")
        .filter((_, i) => i >= 2)
        .join("-")
    : APP_PACKAGE.split(".").join("-");
export const APP_VERSION = package_json.version;
