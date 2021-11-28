const path = require('path');
const {getFileData, getAppConfig, writeFile, getConfigDataJson} = require('./core');
const {rootDirPath, DIR_NAMES} = require('./constant');
const projectName = process.argv[2]?.trim();

const main = () => {
  const fastlaneFilePath = path.join(rootDirPath, DIR_NAMES.android, DIR_NAMES.fastlane, DIR_NAMES.Fastfile);
  const fileData = getFileData(fastlaneFilePath);

  const configDataJson = getConfigDataJson();
  const [appIdName] = getAppConfig(configDataJson, projectName);

  if (!projectName) {
    for (const appName in configDataJson) writeFile(fastlaneFilePath, generateFastlaneConfig(fileData, appName));
    return;
  }
  createFastlaneConfigInFastFile(fastlaneFilePath, fileData, appIdName);
};

const createFastlaneConfigInFastFile = (fastlaneFilePath, fileData, appIdName) => {
  if (fileData.indexOf(appIdName) !== -1) {
    console.warn(`Fastlane config for ${appIdName} already exists`);
    return;
  }
  writeFile(fastlaneFilePath, generateFastlaneConfig(fileData, appIdName));
};


const generateFastlaneConfig = (fileData, appIdName) => {
  return fileData.replace(
    /(?<=platform :android do).*/,
    `
  desc "Submit a new Beta Build"
  lane :beta_${appIdName} do
    gradle(
        task: 'assemble',
        build_type: 'Release',
        flavor: '${appIdName}',
      )
    firebase_app_distribution(
        app: "1:490358966308:android:74efed6b3bc56cb887b0b1",
        groups: "qa-team",
        apk_path: "../build/app/outputs/apk/${appIdName}/release/app-${appIdName}-release.apk",
    )
  end
    `
  );
};

main();
