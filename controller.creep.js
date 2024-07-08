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
            maxHarvesters = 4;
            maxBuilders = 1;
            maxHealers = 1;
            maxUpgraders = 2;
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
            if (room.name == 'W8N3')
                hive.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: harvesterStr}});
            else
                hive.spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: harvesterStr}});

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
