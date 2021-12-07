const cp = require('child_process');
const {getConfigDataJson} = require('./core');
const {SCRIPT_TYPES, BUILD_TYPES, CONSOLE_PROGRESS_MESSAGES} = require('./constant');
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
      generateApp({projectName: projectName, buildType});
      break;
    // Just generates codebase of projects from config.
    case SCRIPT_TYPES.GENERATE_ALL_APP:
      generateApp({projectName: null, buildType});
      break;
    // Build just one app. Required projectName
    case SCRIPT_TYPES.BUILD_APP:
      if (!projectName) {
        console.error(`Specify a specific app name id to run ${SCRIPT_TYPES.BUILD_APP}.`);
        return;
      }
      generateApp({projectName: projectName, buildType});
      buildApp(projectName);
      unloadingAppToFirebase(buildType, projectName);
      break;
    // Build of all apps from config
    case SCRIPT_TYPES.BUILD_ALL_APP:
      const configDataJson = getConfigDataJson();
      generateApp({projectName: null, buildType});
      // todo async
      for (const appName in configDataJson) {
        buildApp(appName);
        unloadingAppToFirebase(buildType, appName);
      }
      break;
  }
};

const buildApp = (projectName) => {
  console.log(CONSOLE_PROGRESS_MESSAGES.BUILDING_APP);
  try {
    cp.execSync(`flutter build apk --flavor ${projectName} -t lib/apps/main_${projectName}.dart --release`);
    console.log(CONSOLE_PROGRESS_MESSAGES.BUILDING_APP_FINISHED);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const unloadingAppToFirebase = (buildType, projectName) => {
  console.log(CONSOLE_PROGRESS_MESSAGES.UNLOADING_TO_FIREBASE);
  try {
    cp.execSync(`cd ../android && fastlane ${buildType}_${projectName}`);
    console.log(CONSOLE_PROGRESS_MESSAGES.UNLOADING_TO_FIREBASE_FINISHED);
  } catch (e) {
    console.error(e);
  }
};


const generateApp = ({projectName, buildType}) => {
  cp.execSync(`node generate_new_app.js ${projectName ?? ''}`);
  cp.exec('node generate_icon.js');
  cp.execSync(`node generate_fastlane_config.js ${projectName ?? ''} ${buildType}`);
};


const isCorrectScriptArgs = () => {
  const stArr = Object.values(SCRIPT_TYPES);
  const btArr = Object.values(BUILD_TYPES);
  let isCorrect = false;

  for (let i = 0; i < stArr.length; i++) {
    for (let j = 0; j < btArr.length; j++) {
      if (`${stArr[i]}:${btArr[j]}` === scriptCommandArgs) {
        isCorrect = true;
      }
    }
  }
  return isCorrect;
};

main();
