# multi_app_flutter

## Getting Started
1. Create `.json` configuration file in directory `tools`
2. Add new app config to the file you just created. 
```
Example
"first_app": {
  "fullAppName": "First App",
  "desc": "desc",
  "image_path": "assets/app_icons/app_icon_first.png",
  "applicationId": "com.multi_app_flutter.multi_app_flutter.firstApp"
}
```

### Creating a new app
Add the new application config to the `config_apps.json` file in the `tools` directory
```
node generate_new_app.js <config file name> <app name id>
```
Or you can just use `node generate_new_app.js <config file name>` to create all projects located in the config file

### Generate app icons

#### In tools directory
```
node generate_icon.js <config file name>
```

