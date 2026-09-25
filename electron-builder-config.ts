// @see - https://www.electron.build/configuration/configuration
import type { Configuration } from "electron-builder";
import { APP_NAME, APP_PACKAGE } from "./config.ts";

const electronBuilderConfig: Configuration = {
  appId: APP_PACKAGE,
  asar: true,
  productName: APP_NAME,
  directories: {
    output: "release/${version}",
  },
  files: ["build/**/*", "dist-electron/**/*", "package.json"],

  mac: {
    icon: "static/AppIcon.icon",
    category: "public.app-category.games",
    target: [
      {
        target: "dmg",
        arch: ["x64", "arm64", "universal"],
      },
      {
        target: "zip",
        arch: ["x64", "arm64", "universal"],
      },
      {
        target: "pkg",
        arch: ["x64", "arm64", "universal"],
      },
    ],
    artifactName: "${productName}-Mac-${version}-${arch}.${ext}",
  },
  pkg: {
    license: "LICENSE",
  },
  dmg: {
    license: "LICENSE",
  },
  win: {
    icon: "static/icon.png",
    target: [
      {
        target: "nsis",
        arch: ["x64", "arm64"],
      },
      {
        target: "msiWrapped",
        arch: ["x64", "arm64"],
      },
      {
        target: "portable",
        arch: ["x64", "arm64"],
      },
      {
        target: "zip",
        arch: ["x64", "arm64"],
      },
    ],
    artifactName: "${productName}-Windows-${version}-${arch}.${ext}",
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false,
    license: "LICENSE",
  },
  msiWrapped: {
    oneClick: false,
  },
  linux: {
    icon: "static/icon.png",
    target: [
      {
        target: "AppImage",
        arch: ["x64", "arm64"],
      },
      {
        target: "rpm",
        arch: ["x64", "arm64"],
      },
      {
        target: "deb",
        arch: ["x64", "arm64"],
      },
      {
        target: "tar",
        arch: ["x64", "arm64"],
      },
      {
        target: "zip",
        arch: ["x64", "arm64"],
      },
    ],
    artifactName: "${productName}-Linux-${version}-${arch}.${ext}",
  },
};
export default electronBuilderConfig;
