require('prototype.creep');

var creepController = {

    /** @param {Creep} creep **/
    run: function(creep)
    {
        if (!creep)
            return;

        // This is where we do things once per creep
        var shouldFill = creep.shouldFill();
        //if (creep.memory.harvestTarget)
        //    console.log('Creep: ' + creep.name + ', harvestTarget: ' + creep.memory.harvestTarget);

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
                if(!creep.tryBuildStructure())
                {
                    creep.moveAndUpgradeController();
                }
            }
        }
        else if(creep.memory.role == 'builder')
        {
            if(shouldFill)
            {
                if(!creep.getEnergyFromContainer())
                    creep.mineClosestEnergy();
            }
            else
            {
                if(!creep.tryBuildStructure())
                {
                    creep.moveAndUpgradeController();
                }
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
    getNumRole: function(list, role, spawningCreep)
    {
        const members = _.filter(list, (creep) => creep.memory.role == role);
        var offset = 0;
        if (spawningCreep && spawningCreep.name.includes(role))
            offset = 1;
        return members.length + offset;
    },
    findHarvestTarget: function(room)
    {
        const myCreeps = room.find(FIND_MY_CREEPS);
        const harvesters = _.filter(myCreeps, (creep) => creep.memory.role == 'harvester');
        let sources = room.find(FIND_SOURCES);
        sources.sort((a,b) => a.id - b.id);
        const num0 = _.filter(harvesters, (creep) => creep.memory.harvestTarget == sources[0].id);
        const num1 = _.filter(harvesters, (creep) => creep.memory.harvestTarget == sources[1].id);

        if (num0 > num1)
            return sources[1].id;
        else
            return sources[0].id
    },
    handleCreepSpawning: function(room)
    {
        const harvesterStr = 'harvester';
        const builderStr = 'builder';
        const healerStr = 'healer';
        const upgraderStr = 'upgrader';
        const explorerStr = 'explorer';

        // Room 1
        var maxHarvesters = 4;
        var maxBuilders = 0;
        var maxHealers = 1;
        var maxUpgraders = 2;
        var maxExplorers = 0;

        // Room 2
        if (room.name == 'W8N2')
        {
            maxHarvesters = 6;
            maxBuilders = 0;
            maxHealers = 1;
            maxUpgraders = 3;
            maxExplorers = 0;
        }
        
        var myCreeps = room.find(FIND_MY_CREEPS);
        const spawns = room.find(FIND_MY_SPAWNS);
        const hive = spawns[0];
        const spawningCreep = hive.spawning;

        var numHarvesters = this.getNumRole(myCreeps, harvesterStr, spawningCreep);
        var numBuilders = this.getNumRole(myCreeps, builderStr, spawningCreep);
        var numHealers = this.getNumRole(myCreeps, healerStr, spawningCreep);
        var numUpgraders = this.getNumRole(myCreeps, upgraderStr, spawningCreep);
        var numExplorers = this.getNumRole(Game.creeps, explorerStr, spawningCreep);
        
        let makeNew = false;
        if(numHarvesters < maxHarvesters) 
        {
            var newName = harvesterStr + Game.time;
            console.log('Spawning new harvester: ' + newName);
            var harvestTarget = this.findHarvestTarget(room);

            if (room.name == 'W8N3')
                hive.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: harvesterStr}});
            else
                hive.spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: harvesterStr, harvestTarget: harvestTarget}});

            makeNew=true;
        }
        else if(numBuilders < maxBuilders)
        {
            var newName = builderStr + Game.time;
            console.log('Spawning new builder: ' + newName);
            if (room.name == 'W8N3')
                hive.spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: builderStr}});   
            else
                hive.spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: builderStr}});
            makeNew=true;
        }
        else if(numUpgraders < maxUpgraders)
        {
            var newName = upgraderStr + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            if (room.name == 'W8N3')
                hive.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: upgraderStr}});
            else
                hive.spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: upgraderStr}});
            makeNew=true;
        }
        else if(numHealers < maxHealers)
        {
            var newName = healerStr + Game.time;
            console.log('Spawning new healer: ' + newName);
            if (room.name == 'W8N3')
                hive.spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: healerStr}});  
            else
                hive.spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
                    {memory: {role: healerStr}});

            makeNew=true;
        }
        else if(numExplorers < maxExplorers)
        {
            var newName = explorerStr + Game.time;
            console.log('Spawning new Explorer: ' + newName);
            if (room.name == 'W8N3')
                hive.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: explorerStr}});  
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
