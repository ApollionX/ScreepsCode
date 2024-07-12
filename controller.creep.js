require('prototype.creep');

var creepController = {

    /** @param {Creep} creep **/
    run: function(creep)
    {
        if (!creep)
            return;

        // This is where we do things once per creep
        var shouldFill = creep.shouldFill();

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
                creep.getEnergyFromLink();
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
                if (!creep.getEnergyFromLink())
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

            //console.log('Room: ' + creep.room.name + ', Home: ' + homeFlag.room.name);
            if(creep.room.name == homeFlag.room.name)
            {
                creep.moveToTarget(targetFlag.pos);
            }
            else
            {
                if (creep.room.controller && creep.room.controller.my)
                {
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
                else
                {
                    if(!creep.moveWithinRangeTarget(targetFlag, 1))
                    {
                        creep.reserveController(creep.room.controller);
                        creep.claimController(creep.room.controller);
                    }
                }
            }
        }
        else if(creep.memory.role == 'producer')
        {
            if(!creep.moveToProducerSpot())
            {
                creep.stationaryMining();
            }
        }
        else if(creep.memory.role == 'consumer')
        {
            if(shouldFill)
            {
                creep.getEnergyFromLink();
            }
            else
            {
                if(!creep.tryDumpEnergyExtension())
                {
                    if(!creep.tryBuildStructure())
                    {
                        creep.moveAndUpgradeController();
                    }
                }
            }
        }
        else
        {
            //WTF?!
            console.log('WTF?!');
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
        const harvesters = _.filter(myCreeps, (creep) => (creep.memory.role == 'harvester' || creep.memory.role == 'producer'));
        let sources = room.find(FIND_SOURCES);
        sources.sort((a,b) => a.id > b.id);
        const num0 = _.filter(harvesters, (creep) => (creep.memory.harvestTarget == sources[0].id && creep.ticksToLive > 0));
        const num1 = _.filter(harvesters, (creep) => (creep.memory.harvestTarget == sources[1].id && creep.ticksToLive > 0));

        if (num0.length > num1.length)
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
        const consumerStr = 'consumer';
        const producerStr = 'producer';

        const myCreeps = room.find(FIND_MY_CREEPS);
        const spawns = room.find(FIND_MY_SPAWNS);
        const hive = spawns[0];
        const spawningCreep = hive.spawning;
        const roomMem = Memory.links[room.name];
        
        var numHarvesters = this.getNumRole(myCreeps, harvesterStr, spawningCreep);
        var numBuilders = this.getNumRole(myCreeps, builderStr, spawningCreep);
        var numHealers = this.getNumRole(myCreeps, healerStr, spawningCreep);
        var numUpgraders = this.getNumRole(myCreeps, upgraderStr, spawningCreep);
        var numExplorers = this.getNumRole(Game.creeps, explorerStr, spawningCreep);
        var numConsumers = this.getNumRole(Game.creeps, consumerStr, spawningCreep);
        var numProducers = this.getNumRole(Game.creeps, producerStr, spawningCreep);
        
        let makeNew = false;
        if(numHarvesters < roomMem.maxHarvesters) 
        {
            var newName = harvesterStr + Game.time;

            var harvestTarget = null;
            if(roomMem.targetedHarvesting)
                harvestTarget = this.findHarvestTarget(room);

            console.log('Spawning new harvester: ' + newName + ', Target: ' + harvestTarget);
            hive.spawnCreep(roomMem.harvesterBody, newName, 
                {memory: {role: harvesterStr, harvestTarget: harvestTarget}});

            makeNew=true;
        }
        else if(numProducers < roomMem.maxProducers) 
        {
            var newName = producerStr + Game.time;

            var harvestTarget = null;
            if(roomMem.targetedHarvesting)
                harvestTarget = this.findHarvestTarget(room);

            console.log('Spawning new producer: ' + newName + ', Target: ' + harvestTarget);
            hive.spawnCreep(roomMem.producerBody, newName, 
                {memory: {role: producerStr, harvestTarget: harvestTarget}});

            makeNew=true;
        }
        else if(numConsumers < roomMem.maxConsumers)
        {
            var newName = consumerStr + Game.time;
            console.log('Spawning new consumer: ' + newName);
            hive.spawnCreep(roomMem.consumerBody, newName, 
                {memory: {role: consumerStr}});   
            makeNew=true;
        }
        else if(numBuilders < roomMem.maxBuilders)
        {
            var newName = builderStr + Game.time;
            console.log('Spawning new builder: ' + newName);
            hive.spawnCreep(roomMem.builderBody, newName, 
                {memory: {role: builderStr}});   
            makeNew=true;
        }
        else if(numUpgraders < roomMem.maxUpgraders)
        {
            var newName = upgraderStr + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            hive.spawnCreep(roomMem.upgraderBody, newName, 
                {memory: {role: upgraderStr}});
            makeNew=true;
        }
        else if(numHealers < roomMem.maxHealers)
        {
            var newName = healerStr + Game.time;
            console.log('Spawning new healer: ' + newName);
            hive.spawnCreep(roomMem.healerBody, newName, 
                {memory: {role: healerStr}});  
            makeNew=true;
        }
        else if(numExplorers < roomMem.maxExplorers)
        {
            var newName = explorerStr + Game.time;
            console.log('Spawning new Explorer: ' + newName);
            hive.spawnCreep(roomMem.explorerBody, newName, 
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
