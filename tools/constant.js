const path = require('path');

const rootDirPath = path.resolve(__dirname, '..');
const configFileName = 'config_apps.json';
const configFilePath = path.resolve(__dirname, configFileName);


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
};
