require('prototype.creep');

var creepController = {

    /** @param {Room} room **/
    run: function(creep)
    {
        if (!creep)
            return;

        // This is where we do things once per creep
        var shouldFill = creep.shouldFill();

        //console.log('Running Creep:' + creep)
        // Work creep work
        if(creep.memory.role == 'harvester')
        {
            if(shouldFill)
            {
                if(!creep.mineClosestEnergy())
                    creep.memory.filling = false
            }
            else 
            {
                // try dump energy
                if(!creep.tryDumpEnergy())
                {
                    if(!creep.tryBuildStructure())
                    {
                        creep.moveAndUpgradeController();
                    }
                }
            }
        }
        else if(creep.memory.role == 'upgrader')
        {
            if(shouldFill) 
            {
                creep.getEnergyFromContainer();
            }
            else
            {
                creep.moveAndUpgradeController();
            }
        }
        else if(creep.memory.role == 'builder')
        {
            if(shouldFill)
            {
                creep.mineClosestEnergy();
            }
            else
            {
                creep.tryBuidStructure();
            }
        }
        else if(creep.memory.role == 'healer')
        {
            if(shouldFill)
            {
                creep.mineClosestEnergy();
            }
            else
            {
                creep.tryAndRepairSomething();
            }
        }
        else
        {
            //WTF?!
        }
    },
    handleCreepSpawning: function(room)
    {
        const numHarvesters = 4;
        const numBuilders = 0;
        const numHealers = 1;
        const numUpgraders = 3;
        
        const myCreeps = room.find(FIND_MY_CREEPS);
        const spawns = room.find(FIND_MY_SPAWNS);

        const harvesters = _.filter(myCreeps, (creep) => creep.memory.role == 'harvester');
        const builders = _.filter(myCreeps, (creep) => creep.memory.role == 'builder');
        const upgraders = _.filter(myCreeps, (creep) => creep.memory.role == 'upgrader');
        const healers = _.filter(myCreeps, (creep) => creep.memory.role == 'healer');
        
        const hive = spawns[0];
        let makeNew = false;
        if(harvesters.length < numHarvesters) 
        {
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            hive.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'harvester'}});
            makeNew=true;
        }
        else if(builders.length < numBuilders)
        {
            var newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            hive.spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'builder'}});   
            makeNew=true;
        }
        else if(upgraders.length < numUpgraders)
        {
            var newName = 'Upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            hive.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'upgrader'}});  
            makeNew=true;
        }
        else if(healers.length < numHealers)
        {
            var newName = 'Healer' + Game.time;
            console.log('Spawning new healer: ' + newName);
            hive.spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
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

module.exports = creepController;
