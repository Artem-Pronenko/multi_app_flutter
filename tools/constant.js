const path = require('path');

const rootDirPath = path.resolve(__dirname, '..');
const configFileName = 'config_apps.json';
const configFilePath = path.resolve(__dirname, configFileName);

const CONSOLE_PROGRESS_MESSAGES = {
  GENERATE_FASTLANE_CONFIG: 'Generate Fastlane config...',
  GENERATE_FASTLANE_CONFIG_FINISHED: 'Fastlane config - Finished!',
  BUILDING_APP: 'Building app...',
  BUILDING_APP_FINISHED: 'Build app - Finished!',
  UNLOADING_TO_FIREBASE: 'Unloading to Firebase...',
  UNLOADING_TO_FIREBASE_FINISHED: 'Unloading to Firebase - Finished!',
  GENERATE_APP_FILES: 'Generate app files...',
  GENERATE_APP_FILES_FINISHED: 'Generate app files - Finished!',
  GENERATE_APP_ICONS: 'Generate app-icon...',
  GENERATE_APP_ICONS_FINISHED: 'Generate app-icon - Finished!',
}

const SCRIPT_TYPES = {
  GENERATE_APP: 'generateApp',
  GENERATE_ALL_APP: 'generateAllApp',
  BUILD_APP: 'buildApp',
  BUILD_ALL_APP: 'buildAllApp',
};

const BUILD_TYPES = {
  BETA: 'beta',
  RELEASE: 'release',
};

const DIR_NAMES = {
  android: 'android',
  fastlane: 'fastlane',
  Fastfile: 'Fastfile',
  flutter_launcher_icons: 'flutter_launcher_icons',
  packages: 'packages',
  flavor_config: 'flavor_config',
  lib: 'lib',
  apps: 'apps',
  app: 'app',
  src: 'src',
  res: 'res',
  values: 'values',
  strings_xml: 'strings.xml',
  build_gradle: 'build.gradle',
  flavor_config_dart: 'flavor_config.dart',
  config: 'config',
};

module.exports = {
  rootDirPath,
  configFileName,
  configFilePath,
  SCRIPT_TYPES,
  BUILD_TYPES,
  DIR_NAMES,
  CONSOLE_PROGRESS_MESSAGES,
};
