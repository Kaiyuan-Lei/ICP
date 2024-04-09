import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Trie "mo:base/Trie";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Bool "mo:base/Bool";
import IcpLedger "canister:icp_ledger_canister";

actor {
  type Key<T> = Trie.Key<T>;
  type Trie<K, V> = Trie.Trie<K, V>;
  func key(id : Principal) : Key<Principal> {
    { hash = Principal.hash(id); key = id };
  };
  // 游戏机厅
  type GameHall = {
    id : Principal;
    name : Text;
    address : Text; // http call back api
  };

  // 游戏机
  type GameMachine = {
    id : Nat;
    name : Text;
    status : Bool;
    price : Nat;
    owner : Text;
  };

  // key: 游戏机厅id  value: 拥有的游戏机数组
  var machinesTrie : Trie<Principal, [GameMachine]> = Trie.empty();
  // key: 游戏机厅id  value: 游戏机厅
  var gameHallsTrie : Trie<Principal, GameHall> = Trie.empty();

  // 新增游戏机厅
  // 时间复杂度O(log n)，Trie中插入一个新的键值对通常需要 O(log n) 时间，其中 n 是字典中的元素数量
  // 空间复杂度O(n)，其中 n 是 gameHallsTrie 中的元素数量
  public shared ({ caller }) func addHall(name : Text, address : Text) : async () {
    let id = caller;
    let hall = { id = caller; name = name; address = address };
    gameHallsTrie := Trie.put(gameHallsTrie, key id, Principal.equal, hall).0;
  };

  // 新增游戏机厅附属的游戏机
  // 时间复杂度 O(log n + m)，n 是 Trie 中的元素数量，m 是 machines 数组的长度
  // 空间复杂度是 O(m)，其中 m 是 machines 数组的长度
  public shared ({ caller }) func addMachine(id : Nat, name : Text, price : Nat) : async () {
    var machinesOpt = Trie.find<Principal, [GameMachine]>(machinesTrie, key caller, Principal.equal);
    let newMachine : GameMachine = {
      id = id;
      name = name;
      status = true;
      price = price;
      // 默认游戏机厅拥有者为游戏机厅创建者
      owner = Principal.toText(caller);
    };
    var newMachines : [GameMachine] = [];
    switch (machinesOpt) {
      case (null) { newMachines := [newMachine] };
      case (?machines) {
        newMachines := Array.append<GameMachine>(machines, [newMachine]);
      };
    };
    machinesTrie := Trie.replace(machinesTrie, key caller , Principal.equal, ?newMachines).0;
  };

  // 获取游戏机信息
  public shared func getMachineInfo(id : Nat, owner : Text) : async (GameMachine) {
    var machines = Trie.get(machinesTrie, key(Principal.fromText(owner)), Principal.equal);
    switch (machines) {
      case (null) {
        return { id = 0; name = ""; status = false; price = 0; owner = "" };
      };
      case (?machines) {
        var result : GameMachine = { id = 0; name = ""; status = false; price = 0; owner = "" };
        label down for(machine in machines.vals()){
          if (Nat.equal(machine.id, id)){
            result := machine;
            break down;
          };
        };
        return result;
      };
    };
  };

  // 获取游戏机列表
  // 时间复杂度是 O(log n)，其中 n 是 Trie 中的元素数量
  // 空间复杂度是 O(m)，其中 m 是 machines 数组的长度
  public shared ({ caller }) func machineList() : async ([GameMachine]) {
    var machines = Trie.get(machinesTrie, key caller, Principal.equal);
    switch (machines) {
      case (null) {
        return [];
      };
      case (?machines) {
        return machines;
      };
    };
  };

  public shared ({ caller }) func hallInfo() : async (?GameHall) {
    Trie.get(gameHallsTrie, key caller, Principal.equal);
  };

  // 支付相关
  public shared ({ caller }) func balance(): async(Nat){
    await IcpLedger.icrc1_balance_of({owner=caller; subaccount=null})
  };

  public shared ({ caller }) func fee(): async(Nat){
    await IcpLedger.icrc1_fee()
  };

  public shared({caller}) func pay(amount: Nat, to: Text): async(Bool){
    let tx : IcpLedger.TransferFromArgs = {
      from = {owner=caller;subaccount=null};
      memo=null;
      amount=amount;
      spender_subaccount=null;
      fee=null;
      to={owner=Principal.fromText(to); subaccount=null};
      created_at_time=null;
    };
    try{
      let result = await IcpLedger.icrc2_transfer_from(tx);
      switch(result){
        case(#Err(transferError)){
          return false;
        };
        case(#Ok(blockIndex)){
          return true;
        };
      };
    }catch(error: Error){
        return false
    }
  };


};
