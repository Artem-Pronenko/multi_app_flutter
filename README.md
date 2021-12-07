# Multi App. Flutter Project.

## Getting Started

## Running app:

`flutter run --flavor <your_app_name> -t lib/apps/main_<your_app_name>.dart`

# Example of running main test app

`flutter run --flavor base_app -t lib/apps/main_base_app.dart`

## Manually building app apk:

`flutter build apk --flavor <your_app_name> -t lib/apps/main_<your_app_name>.dart --release`

## Using the build utility

### Generate new app files

1. Install [Node.js](https://nodejs.org) on your pc
2. Add new app config to file ./tools/config_apps.json [Config example](#config_example)
3. In directory ./tools run command `node build_tool.js generateApp <your_app_name>`

## Build and deploy your app to Firebase

`node build_tool.js buildApp:dev <your_app_name>`

### Or you can build and deploy all yor app (Based on your config)

`node build_tool.js buildAllApp:dev`

[//]: <> (Sometimes between changing flavors is necessary a **flutter clean** to clean our app build files.)

### <a name="config_example">Config example</a>
```json
{
  "<app_name>": {
    "fullAppName": "My amazing app",
    "desc": "My amazing description (no required)",
    "image_path": "assets/icon/app_logo.jpg",
    "applicationId": "com.appId.appId",
    "firebase_app_android_id": "1:1111:android:11111111",
    "tester_group": "qa-team",
    "appSettings": {
      "baseApiUrl": "https://baseApiUrl (no required)",
      ...
    }
  }
}
```

## Manually generate app icon
`node generate_icon.js`
