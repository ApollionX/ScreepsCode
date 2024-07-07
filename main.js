var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleHealer = require('role.healer');
var globals = require('globals');

module.exports.loop = function () {
    
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var healers = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer');
    
    //let hive = new RoomPosition(28, 30, 'W8N3');
    //let energy1 = new RoomPosition(23, 42, 'W8N3');
    //globals.makeRoadBetweenPoints(hive,energy1);
    
    
    var tower = null;
    if (harvesters.length > 0){
    tower = harvesters[0].room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
            })[0];
    }
    globals.singleTower(tower);
    globals.spawnCreeps();
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'healer') {
            roleHealer.run(creep);
        }
    }
}