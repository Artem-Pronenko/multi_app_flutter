import 'package:multi_app_flutter/config/flavor_config.dart';
import 'package:multi_app_flutter/config/flavor_second_app.dart';
import 'package:multi_app_flutter/main_common.dart';

void main() {
  mainCommon(
    FlavorConfig(
      values: envSecondApp,
    ),
  );
}
