const cp = require('child_process');
const {getConfigDataJson} = require('./core');
const path = require('path');
const {rootDirPath, SCRIPT_TYPES, DIR_NAMES, BUILD_TYPES} = require('./constant');
const scriptCommandArgs = process.argv[2]?.trim();
const projectName = process.argv[3]?.trim();

const main = () => {
  if (!isCorrectScriptArgs()) {
    console.error(`
    The argument to run the script is missing. 
    Select SCRIPT_TYPE and BUILD_TYPE.
    And pass them in format SCRIPT_TYPE:BUILD_TYPE`);
    console.info(`
    SCRIPT_TYPES: ${Object.values(SCRIPT_TYPES).join(', ')}
    BUILD_TYPES: ${Object.values(BUILD_TYPES).join(', ')}`);
    return;
  }
  const [scriptType, buildType] = scriptCommandArgs.split(':');

  switch (scriptType) {
    // Just generates codebase of project. Required projectName
    case SCRIPT_TYPES.GENERATE_APP:
      if (!projectName) {
        console.error(`Specify a specific app name id to run ${SCRIPT_TYPES.GENERATE_APP}.`);
        return;
      }
      generateApp();
      break;
    // Just generates codebase of projects from config.
    case SCRIPT_TYPES.GENERATE_ALL_APP:
      generateApp();
      break;
    // Build just one app. Required projectName
    case SCRIPT_TYPES.BUILD_APP:
      if (!projectName) {
        console.error(`Specify a specific app name id to run ${SCRIPT_TYPES.BUILD_APP}.`);
        return;
      }
      generateApp();
      cp.exec(`${path.join(rootDirPath, DIR_NAMES.android)} fastlane ${buildType}_${projectName}`);
      break;
    // Build of all apps from config
    case SCRIPT_TYPES.BUILD_ALL_APP:
      const configDataJson = getConfigDataJson();
      generateApp();
      for (const appName in configDataJson) {
        cp.exec(`${path.join(rootDirPath, DIR_NAMES.android)} fastlane ${buildType}_${appName}`);
      }
      break;
  }
};

const isCorrectScriptArgs = () => {
  const stArr = Object.values(SCRIPT_TYPES);
  const btArr = Object.values(BUILD_TYPES);
  let isCorrect = false;

  if (scriptCommandArgs === SCRIPT_TYPES.GENERATE_APP || scriptCommandArgs === SCRIPT_TYPES.GENERATE_ALL_APP) {
    isCorrect = true;
  }

  for (let i = 0; i < stArr.length; i++) {
    for (let j = 0; j < btArr.length; j++) {
      if (`${stArr[i]}:${btArr[j]}` === scriptCommandArgs) {
        isCorrect = true;
      }
    }
  }
  return isCorrect;
};

const generateApp = (projectName) => {
  cp.execSync(`node generate_new_app.js ${projectName ?? ''}`);
  cp.exec('node generate_icon.js');
  cp.execSync(`node generate_fastlane_config.js ${projectName ?? ''}`);
};

main();
