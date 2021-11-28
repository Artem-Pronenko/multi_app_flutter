const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const {rootDirPath, DIR_NAMES} = require('./constant');
const {writeFile, getConfigDataJson} = require('./core');

//
// generate_icon.js is not needed in the name of the application for which you need to create an icon,
// since the flutter_launcher_icons plugin generates icons for all app that are indicated in the flavors
const main = () => {
  let appName = null;

  const configDateJson = getConfigDataJson();
  for (const key in configDateJson) {
    if (!configDateJson.hasOwnProperty(key)) {
      return;
    }
    appName = key;
    const image_path = configDateJson[key]['image_path'];
    writeFile(path.join(rootDirPath, `${DIR_NAMES.flutter_launcher_icons}-${appName}.yaml`), generateIconYamlConfig(image_path));
  }
  cp.execSync(`cd .. && flutter pub run ${DIR_NAMES.flutter_launcher_icons}:main -f ${DIR_NAMES.flutter_launcher_icons}-${appName}.yaml`);

  for (const key in configDateJson) {
    if (!configDateJson.hasOwnProperty(key)) {
      return;
    }
    fs.unlink(path.join(rootDirPath, `${DIR_NAMES.flutter_launcher_icons}-${key}.yaml`), (err => {
      if (err) {
        console.error(err);
      }

    }));
  }

};

const generateIconYamlConfig = (image_path) => {
  return `flutter_icons:
  android: true
  ios: true
  image_path: ${image_path}`;
};

main();
