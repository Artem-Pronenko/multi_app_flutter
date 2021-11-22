const fs = require('fs');
const path = require('path');
const {getFileData, getAppConfig, writeFile, mkdir} = require('./core');
const configName = process.argv[2]?.trim();
const projectName = process.argv[3]?.trim();


const rootDirPath = `${path.resolve(__dirname, '../')}`;
const flavorConfigPath = `${path.resolve(__dirname, '../packages/flavor_config')}`;
const entryPointAppsDirPath = `${path.resolve(__dirname, '../lib/apps')}`;

const main = () => {
  if (!configName) throw 'Config file name not passed';
  if (!projectName) throw 'Project name file not passed';

  const configPath = `${path.resolve(__dirname)}/${configName}`;
  const configDateJson = JSON.parse(getFileData(configPath).toString());
  const [appIdName, appConfig] = getAppConfig(configDateJson, projectName);


  createAppDirInAndroid(appIdName, appConfig);
  createEntryInConfig(appIdName, appConfig);
  createFlavorConfigInPackages(appIdName, appConfig);
};


// Creating an application directory in android/app/src
const createAppDirInAndroid = (appIdName, appConfig) => {
  const newAppDir = `${rootDirPath}/android/app/src/${appIdName}`;
  mkdir(`${newAppDir}/res/values`);
  writeFile(`${newAppDir}/res/values/strings.xml`, generateStringsXml(appConfig['fullAppName']));
};


// Creating a flavor config entry in the build.gradle file
const createEntryInConfig = (appIdName, appConfig) => {
  // todo make it possible to overwrite flavor
  const fileData = getFileData(`${rootDirPath}/android/app/build.gradle`);

  if (fileData.indexOf(appIdName) !== -1) {
    console.error('This flavor already exists in the build.gradle file');
  } else {
    const flavorConfigAppData = generateFlavorConfigAppForGradle(fileData, appIdName, appConfig);
    writeFile(`${rootDirPath}/android/app/build.gradle`, flavorConfigAppData);
  }
};

// Creating a default flavor config in the package
const createFlavorConfigInPackages = (appIdName, appConfig) => {
  const flavorConfigFileName = `flavor_${appIdName}.dart`;
  const flavorConfigExportsFilePath = `${flavorConfigPath}/lib/flavor_config.dart`;

  writeFile(`${flavorConfigPath}/lib/config/${flavorConfigFileName}`, generateFlavorConfigDart(appIdName, appConfig));
  writeFile(`${entryPointAppsDirPath}/main_${appIdName}.dart`, generateEntryPointAppDart(`env${appIdName}`));

  if (getFileData(flavorConfigExportsFilePath).indexOf(flavorConfigFileName) !== -1) {
    console.error('This file is already being imported into flavor_config.dart');
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
        }
    `
  );
};

const generateFlavorConfigDart = (appNameId, appConfig) => {
  return `import 'flavor_config.dart';

final env${appNameId} = FlavorValues(
    nameApp: '${appConfig['fullAppName']}',
);`;
};

const generateEntryPointAppDart = (appNameId) => {
  return `import 'package:flavor_config/flavor_config.dart';
import 'package:multi_app_flutter/main_common.dart';

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
