require('prototype.creep');

var creepController = {

    /** @param {Creep} creep **/
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
                if(!creep.getEnergyFromContainer())
                    creep.mineClosestEnergy();
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
                if(!creep.getEnergyFromContainer())
                    creep.mineClosestEnergy();
            }
            else
            {
                creep.tryAndRepairSomething();
            }
        }
        else if(creep.memory.role == 'explorer')
        {
            var homeFlag = Game.flags['TheHive'];
            var targetFlag = Game.flags['Flag1'];

            console.log('Room: ' + creep.room.name + ', Home: ' + homeFlag.room.name);
            if(creep.room.name == homeFlag.room.name)
            {
                console.log('moving to flag room');
                creep.moveToTarget(targetFlag.pos);
            }
            else
            {
                console.log('In flag room!');
                if(shouldFill)
                {
                    creep.mineClosestEnergyToTarget(targetFlag.pos);
                }
                else
                {
                    if(!creep.tryBuildStructure())
                    {
                        creep.tryDumpEnergy();
                    }
                }
            }
        }
        else
        {
            //WTF?!
        }
    },
    handleCreepSpawning: function(room)
    {

        // Room 1
        var numHarvesters = 4;
        var numBuilders = 0;
        var numHealers = 1;
        var numUpgraders = 2;
        var numExplorers = 0;

        // Room 2
        if (room.name == 'W8N2')
        {
            numHarvesters = 4;
            numBuilders = 0;
            numHealers = 1;
            numUpgraders = 2;
            numExplorers = 0;
        }
        

        const myCreeps = room.find(FIND_MY_CREEPS);
        const spawns = room.find(FIND_MY_SPAWNS);

        const harvesters = _.filter(myCreeps, (creep) => creep.memory.role == 'harvester');
        const builders = _.filter(myCreeps, (creep) => creep.memory.role == 'builder');
        const upgraders = _.filter(myCreeps, (creep) => creep.memory.role == 'upgrader');
        const healers = _.filter(myCreeps, (creep) => creep.memory.role == 'healer');
        const explorers = _.filter(Game.creeps, (creep) => creep.memory.role == 'explorer');
        
        const hive = spawns[0];
        let makeNew = false;
        if(harvesters.length < numHarvesters) 
        {
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            if (room.name == 'W8N3')
                hive.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: 'harvester'}});
            else
                hive.spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: 'harvester'}});

            makeNew=true;
        }
        else if(builders.length < numBuilders)
        {
            var newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            if (room.name == 'W8N3')
                hive.spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: 'builder'}});   
            else
                hive.spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: 'builder'}});
            makeNew=true;
        }
        else if(upgraders.length < numUpgraders)
        {
            var newName = 'Upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            if (room.name == 'W8N3')
                hive.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: 'upgrader'}});
            else
                hive.spawnCreep([WORK,CARRY,MOVE,CARRY,MOVE], newName, 
                    {memory: {role: 'upgrader'}});
            makeNew=true;
        }
        else if(healers.length < numHealers)
        {
            var newName = 'Healer' + Game.time;
            console.log('Spawning new healer: ' + newName);
            if (room.name == 'W8N3')
                hive.spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: 'healer'}});  
            else
                hive.spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
                    {memory: {role: 'healer'}});

            makeNew=true;
        }
        else if(explorers.length < numExplorers)
        {
            var newName = 'Explorer' + Game.time;
            console.log('Spawning new Explorer: ' + newName);
            if (room.name == 'W8N3')
                hive.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: 'explorer'}});  
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
