library logic_repository;

class LogicRepository {
  bool _isLogic = false;

  get getLogic => _isLogic;

  set setLogic(bool logic) => _isLogic = logic;
}
