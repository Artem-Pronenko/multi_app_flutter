import 'package:flavor_config/flavor_config.dart';
import 'package:multi_app_flutter/main_common.dart';

void main() {
  mainCommon(
    FlavorConfig(
      values: envFirstApp,
    ),
  );
}
