import 'package:base_app/screens/screens.dart';
import 'package:flavor_config/flavor_config.dart';
import 'package:flutter/material.dart';

class SecondScreen extends StatelessWidget {
  const SecondScreen({Key? key}) : super(key: key);
  static const routeName = '/SecondScreen';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(FlavorConfig.instance?.values.nameApp ?? 'BaseApp First Screen')),
      body: SafeArea(
        child: Center(
          child: TextButton(
            onPressed: () =>
                Navigator.pushReplacementNamed(context, FirstScreen.routeName),
            child: const Text('Go to first screen'),
          ),
        ),
      ),
    );
  }
}
