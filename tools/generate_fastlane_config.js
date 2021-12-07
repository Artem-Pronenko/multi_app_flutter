const path = require('path');
const {getFileData, getAppConfig, writeFile, getConfigDataJson} = require('./core');
const {rootDirPath, DIR_NAMES, CONSOLE_PROGRESS_MESSAGES} = require('./constant');
const projectName = process.argv[2]?.trim();
const deployType = process.argv[3]?.trim();

const main = () => {
  console.log(CONSOLE_PROGRESS_MESSAGES.GENERATE_FASTLANE_CONFIG);
  if (!deployType) {
    console.error('required parameter deployType');
    return;
  }
  const fastlaneFilePath = path.join(rootDirPath, DIR_NAMES.android, DIR_NAMES.fastlane, DIR_NAMES.Fastfile);
  const fileData = getFileData(fastlaneFilePath);

  const configDataJson = getConfigDataJson();
  const [appIdName, appConfig] = getAppConfig(configDataJson, projectName);

  if (!projectName) {
    for (const appName in configDataJson) writeFile(fastlaneFilePath, generateFastlaneConfig(fileData, appName, configDataJson[appName]));
    return;
  }
  createFastlaneConfigInFastFile(fastlaneFilePath, fileData, appIdName, appConfig);
  console.log(CONSOLE_PROGRESS_MESSAGES.GENERATE_FASTLANE_CONFIG_FINISHED);
};


const createFastlaneConfigInFastFile = (fastlaneFilePath, fileData, appIdName, appConfig) => {
  const fastlaneLane = `${deployType}_${appIdName}`;
  if (fileData.indexOf(fastlaneLane) !== -1) {
    console.warn(`Fastlane config for ${fastlaneLane} already exists`);
    return;
  }
  writeFile(fastlaneFilePath, generateFastlaneConfig(fileData, appIdName, appConfig));
};


const generateFastlaneConfig = (fileData, appIdName, appConfig) => {
  return fileData.replace(
    /(?<=platform :android do).*/,
    `
  desc "Submit a new Beta Build"
  lane :${deployType}_${appIdName} do
    firebase_app_distribution(
        app: "${appConfig['firebase_app_android_id']}",
        groups: "${appConfig['tester_group']}",
        apk_path: "../build/app/outputs/apk/${appIdName}/release/app-${appIdName}-release.apk",
    )
  end
    `
  );
};

main();
