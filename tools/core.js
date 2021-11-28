const fs = require('fs');
const {configFilePath, configFileName} = require('./constant');


const getConfigDataJson = () => {
  try {
    if (fs.existsSync(configFilePath)) {
      return JSON.parse(getFileData(configFilePath).toString());
    }
  } catch (err) {
    throw `Config file named ${configFileName} was not found in the tools directory`;
  }
};

const getFileData = (path) => {
  try {
    return fs.readFileSync(path, 'utf-8');
  } catch (err) {
    console.error(err);
  }
};

const mkdir = (path) => {
  try {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, {recursive: true});
    }
  } catch (err) {
    console.error(err);
  }
};

const writeFile = (path, data) => {
  try {
    fs.writeFileSync(path, data);
  } catch (err) {
    console.error(err);
  }
};

const getAppConfig = (json, appName) => {
  for (const key in json) {
    if (!json.hasOwnProperty(key)) {
      return [];
    }
    if (key === appName) {
      return [key, json[key]];
    }
  }
  return [];
};

module.exports = {
  getConfigDataJson,
  getFileData,
  writeFile,
  mkdir,
  getAppConfig,
};