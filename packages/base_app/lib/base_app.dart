import 'package:flutter/material.dart';
import 'package:logic_repository/logic_repository.dart';
import 'screens/screens.dart';

class BaseApp extends StatelessWidget {
  BaseApp({Key? key}) : super(key: key);
  final LogicRepository _logicRepository = LogicRepository();

  Route _onGenerateRoute(RouteSettings settings) {
    Widget screen;
    switch (settings.name) {
      case FirstScreen.routeName:
        screen = FirstScreen(logicRepository: _logicRepository);
        break;
      case SecondScreen.routeName:
        screen = const SecondScreen();
        break;
      default:
        screen = FirstScreen(logicRepository: _logicRepository);
    }
    return MaterialPageRoute(
      builder: (context) => screen,
      settings: settings,
    );
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: FirstScreen(logicRepository: _logicRepository),
      onGenerateRoute: _onGenerateRoute,
      routes: {
        FirstScreen.routeName: (context) => FirstScreen(logicRepository: _logicRepository),
        SecondScreen.routeName: (context) => const SecondScreen(),
      },
    );
  }
}
