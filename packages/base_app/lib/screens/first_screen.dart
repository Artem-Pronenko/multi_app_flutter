import 'package:base_app/screens/screens.dart';
import 'package:flavor_config/config/flavor_config.dart';
import 'package:flutter/material.dart';
import 'package:logic_repository/logic_repository.dart';

class FirstScreen extends StatefulWidget {
  static const routeName = '/FirstScreen';
  final LogicRepository logicRepository;

  const FirstScreen({Key? key, required this.logicRepository})
      : super(key: key);

  @override
  State<FirstScreen> createState() => _FirstScreenState();
}

class _FirstScreenState extends State<FirstScreen> {
  @override
  void initState() => super.initState();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: () => setState(() {
          widget.logicRepository.setLogic = !widget.logicRepository.getLogic;
        }),
        child: Text(widget.logicRepository.getLogic.toString()),
      ),
      appBar: AppBar(title: Text(FlavorConfig.instance?.values.nameApp ?? 'BaseApp First Screen')),
      body: SafeArea(
        child: Center(
          child: TextButton(
            onPressed: () =>
                Navigator.pushReplacementNamed(context, SecondScreen.routeName),
            child: const Text('Go to second screen'),
          ),
        ),
      ),
    );
  }
}
