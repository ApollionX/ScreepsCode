const globals = 
{
    getEnergyFromContainer: function(creep) 
    {  
        var containerWithEnergy = creep.room.find(FIND_STRUCTURES, 
            {
                filter: (structure) => {return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0;}
            })[0];
            
        if(creep.withdraw(containerWithEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(containerWithEnergy, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    },
    mineClosestNode: function(creep) 
    {  
        var closestSourceWithEnegry = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
            filter: (source) => source.energy > 0
        });
        if(creep.harvest(closestSourceWithEnegry) == ERR_NOT_IN_RANGE) 
        {
            creep.moveTo(closestSourceWithEnegry, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    },
    spawnCreeps: function() 
    {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var healers = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer');
    
        var makeNew = false;
        if(harvesters.length < 5) 
        {
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            Game.spawns['TheHive'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'harvester'}});
            makeNew=true;
        }
        else if(builders.length < 1)
        {
            var newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            Game.spawns['TheHive'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'builder'}});   
            makeNew=true;
        }
        else if(upgraders.length < 1)
        {
            var newName = 'Upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            Game.spawns['TheHive'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'upgrader'}});  
            makeNew=true;
        }
        else if(healers.length < 1)
        {
            var newName = 'Healer' + Game.time;
            console.log('Spawning new healer: ' + newName);
            Game.spawns['TheHive'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'healer'}});  
            makeNew=true;
        }
        
        if (makeNew)
        {
            for (var name in Memory.creeps)
            {
                if (!Game.creeps[name]) {
                    delete Memory.creeps[name];
                    console.log('Clearing non-existing creep memory:', name);
                }
            }
        }
    }
};

module.exports = globals;