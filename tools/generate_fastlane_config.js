const path = require('path');
const {getFileData, getAppConfig, writeFile} = require('./core');
const configName = process.argv[2]?.trim();
const projectName = process.argv[3]?.trim();


const rootDirPath = path.resolve(__dirname, '..');

const main = () => {
  const fastlaneFilePath = path.join(rootDirPath, 'android', 'fastlane', 'Fastfile');
  const fileData = getFileData(fastlaneFilePath);

  const configPath = path.resolve(__dirname, configName);
  const configDateJson = JSON.parse(getFileData(configPath).toString());
  const [appIdName, configApp] = getAppConfig(configDateJson, projectName);
  writeFile(fastlaneFilePath, generateFastlaneConfig(fileData, appIdName, configApp));

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
