const fs = require('fs');

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
  console.error('Application name not found in config file');
  return [];
};

module.exports = {
  getFileData,
  writeFile,
  mkdir,
  getAppConfig,
};