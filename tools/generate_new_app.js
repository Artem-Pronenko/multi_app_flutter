const fs = require('fs');
const path = require('path');
const {getFileData, getAppConfig, writeFile, mkdir, getConfigDataJson} = require('./core');
const {rootDirPath, DIR_NAMES, CONSOLE_PROGRESS_MESSAGES} = require('./constant');
const projectName = process.argv[2]?.trim();

const flavorConfigPath = path.resolve(__dirname, '..', DIR_NAMES.packages, DIR_NAMES.flavor_config);
const entryPointAppsDirPath = path.resolve(__dirname, '..', DIR_NAMES.lib, DIR_NAMES.apps);

const main = () => {
  console.log(CONSOLE_PROGRESS_MESSAGES.GENERATE_APP_FILES);
  const configDataJson = getConfigDataJson();
  const [appIdName, appConfig] = getAppConfig(configDataJson, projectName);

  if (!projectName) {
    for (const appName in configDataJson) {
      createAppDirInAndroid(appName, configDataJson[appName]);
      createEntryInConfig(appName, configDataJson[appName]);
      createFlavorConfigInPackages(appName, configDataJson[appName]);
    }
    return;
  }

  if (!appConfig) {
    console.error('Application config not found in config file');
    return;
  }

  createAppDirInAndroid(appIdName, appConfig);
  createEntryInConfig(appIdName, appConfig);
  createFlavorConfigInPackages(appIdName, appConfig);
  console.log(CONSOLE_PROGRESS_MESSAGES.GENERATE_APP_FILES_FINISHED);
};


// Creating an application directory in android/app/src
const createAppDirInAndroid = (appIdName, appConfig) => {
  const newAppDir = path.join(rootDirPath, DIR_NAMES.android, DIR_NAMES.app, DIR_NAMES.src, appIdName);
  mkdir(path.join(newAppDir, DIR_NAMES.res, DIR_NAMES.values));
  writeFile(
    path.join(newAppDir, DIR_NAMES.res, DIR_NAMES.values, DIR_NAMES.strings_xml),
    generateStringsXml(appConfig['fullAppName'])
  );
};


// Creating a flavor config entry in the build.gradle file
const createEntryInConfig = (appIdName, appConfig) => {
  // todo make it possible to overwrite flavor
  const fileData = getFileData(path.join(rootDirPath, DIR_NAMES.android, DIR_NAMES.app, DIR_NAMES.build_gradle));

  if (fileData.indexOf(appIdName) !== -1) {
    console.warn(`${appIdName} flavor already exists in the ${DIR_NAMES.build_gradle} file`);
  } else {
    const flavorConfigAppData = generateFlavorConfigAppForGradle(fileData, appIdName, appConfig);
    writeFile(path.join(rootDirPath, DIR_NAMES.android, DIR_NAMES.app, DIR_NAMES.build_gradle), flavorConfigAppData);
  }
};

// Creating a default flavor config in the package
// Creating a default main entry point file
const createFlavorConfigInPackages = (appIdName, appConfig) => {
  const flavorConfigFileName = `flavor_${appIdName}.dart`;
  const flavorConfigExportsFilePath = path.join(flavorConfigPath, DIR_NAMES.lib, DIR_NAMES.flavor_config_dart);
  const flavorConfigFilePath = path.join(flavorConfigPath, DIR_NAMES.lib, DIR_NAMES.config, flavorConfigFileName);
  const mainEntryPointFilePath = path.join(entryPointAppsDirPath, `main_${appIdName}.dart`);

  if (!fs.existsSync(flavorConfigFilePath)) {
    writeFile(flavorConfigFilePath, generateFlavorConfigDart(appIdName, appConfig));
  }

  if (!fs.existsSync(mainEntryPointFilePath)) {
    writeFile(mainEntryPointFilePath, generateEntryPointAppDart(`env${appIdName}`));
  }

  if (getFileData(flavorConfigExportsFilePath).indexOf(flavorConfigFileName) !== -1) {
    console.warn(`${flavorConfigFileName} file is already being imported into flavor_config.dart`);
    return;
  }
  fs.appendFileSync(flavorConfigExportsFilePath, `\nexport 'config/${flavorConfigFileName}';`);

};


const generateFlavorConfigAppForGradle = (fileData, appIdName, appConfig) => {
  return fileData.replace(
    /(?<=productFlavors).*/,
    ` {
        ${appIdName} {
            dimension "flavor-type"
            applicationId "${appConfig['applicationId']}"
            versionNameSuffix "-dev"
            signingConfig signingConfigs.release
        }
    `
  );
};

const generateFlavorConfigDart = (appNameId, appConfig) => {
  return `import 'flavor_config.dart';

final env${appNameId} = FlavorValues(
    nameApp: '${appConfig['fullAppName']}',
    ${generateFlavorConfig(appConfig)}
);`;
};


const generateFlavorConfig = (appConfig) => {
  const appSettings = appConfig['appSettings'];
  let config = '';
  for (const key in appSettings) {
    config += `${key}: "${appSettings[key]}",
    `;
  }
  return config;

};

const generateEntryPointAppDart = (appNameId) => {
  return `import 'package:flavor_config/flavor_config.dart';
import 'package:rapidone/main_common.dart';

void main() {
  mainCommon(
    FlavorConfig(
      values: ${appNameId},
    ),
  );
}`;
};


const generateStringsXml = (appName) => {
  return `<?xml version="1.0" encoding="utf-8" ?>
<resources>
    <string name="app_name">${appName}</string>
</resources>`;
};

main();
