const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const configName = process.argv[2]?.trim();
const FLUTTER_LAUNCHER_ICONS = 'flutter_launcher_icons';

const main = () => {
  if (!configName) {
    throw 'Config file name not passed';
  }
  let appName = null;
  const configPath = path.resolve(__dirname, configName);
  const rootDirPath = `${path.resolve(__dirname, '..')}`;

  const configDateJson = JSON.parse(getFileData(configPath).toString());
  for (const key in configDateJson) {
    if (!configDateJson.hasOwnProperty(key)) {
      return;
    }
    appName = key;
    const image_path = configDateJson[key]['image_path'];
    writeFile(`${rootDirPath}/${FLUTTER_LAUNCHER_ICONS}-${appName}.yaml`, generateIconYamlConfig(image_path));
  }
  cp.execSync(`cd .. && flutter pub run ${FLUTTER_LAUNCHER_ICONS}:main -f ${FLUTTER_LAUNCHER_ICONS}-${appName}.yaml`);

  for (const key in configDateJson) {
    if (!configDateJson.hasOwnProperty(key)) {
      return;
    }
    fs.unlink(`${rootDirPath}/${FLUTTER_LAUNCHER_ICONS}-${key}.yaml`, (err => {
      if (err) {
        console.error(err);
      }

    }))
  }

};


const getFileData = (path) => {
  try {
    return fs.readFileSync(path, 'utf-8');
  } catch (err) {
    console.error(err);
  }
};

const writeFile = (path, data,) => {
  try {
    fs.writeFileSync(path, data);
  } catch (err) {
    console.error(err);
  }
};

const generateIconYamlConfig = (image_path) => {
  return `flutter_icons:
  android: true
  ios: true
  image_path: ${image_path}`;
};

main();
