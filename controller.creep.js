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
        else if(creep.memory.role == 'attacker') 
        {
            var rallyFlag = Game.flags['Rally'];
            var killFlag = Game.flags['Kill'];
            if(killFlag)
            {
                creep.attackArea(killFlag.pos);
            }
            else if(rallyFlag)
            {
                creep.moveWithinRangeTarget(rallyFlag, 3);
            }
        }
        else
        {
            //WTF?!
            console.log('WTF?!');
        }
    },
    getNumRole: function(list, role)
    {
        if (!list || !role)
            return;
        return _.filter(list, (creep) => creep.memory.role == role).length;
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
        const spawns = room.find(FIND_MY_SPAWNS);
        if (!spawns || (spawns.length < 1))
            return;
        
        for (let spawn of spawns)
        {
            if(spawn.spawning)
                return;
        }

        const harvesterStr = 'harvester';
        const builderStr = 'builder';
        const healerStr = 'healer';
        const upgraderStr = 'upgrader';
        const explorerStr = 'explorer';
        const consumerStr = 'consumer';
        const producerStr = 'producer';
        const attackerStr = 'attacker';

        const myCreeps = room.find(FIND_MY_CREEPS);
        const hive = spawns[0];
        const roomMem = Memory.links[room.name];
        
        var numHarvesters = this.getNumRole(myCreeps, harvesterStr);
        var numBuilders = this.getNumRole(myCreeps, builderStr);
        var numHealers = this.getNumRole(myCreeps, healerStr);
        var numUpgraders = this.getNumRole(myCreeps, upgraderStr);
        var numExplorers = this.getNumRole(Game.creeps, explorerStr);
        var numConsumers = this.getNumRole(myCreeps, consumerStr);
        var numProducers = this.getNumRole(myCreeps, producerStr);
        var numAttackers = this.getNumRole(myCreeps, attackerStr);

        //console.log('Attacker: ' + numAttackers);

        if(numHarvesters < roomMem.maxHarvesters) 
        {
            var harvestTarget = null;
            if(roomMem.targetedHarvesting)
                harvestTarget = this.findHarvestTarget(room);

            if(OK == hive.spawnCreep(roomMem.harvesterBody, harvesterStr + Game.time, 
                {memory: {role: harvesterStr, harvestTarget: harvestTarget}}))
                console.log('Spawning new harvester, Target: ' + harvestTarget);
        }
        else if(numProducers < roomMem.maxProducers) 
        {
            var harvestTarget = null;
            if(roomMem.targetedHarvesting)
                harvestTarget = this.findHarvestTarget(room);

            if(OK == hive.spawnCreep(roomMem.producerBody, producerStr + Game.time, 
                {memory: {role: producerStr, harvestTarget: harvestTarget}}))
                console.log('Spawning new producer, Target: ' + harvestTarget);
        }
        else if(numConsumers < roomMem.maxConsumers)
        {
            if(OK == hive.spawnCreep(roomMem.consumerBody, consumerStr + Game.time, 
                {memory: {role: consumerStr}})) 
                console.log('Spawning new consumer');
        }
        else if(numBuilders < roomMem.maxBuilders)
        {
            if(OK == hive.spawnCreep(roomMem.builderBody, builderStr + Game.time, 
                {memory: {role: builderStr}}))
                console.log('Spawning new builder');
        }
        else if(numUpgraders < roomMem.maxUpgraders)
        {
            if(OK == hive.spawnCreep(roomMem.upgraderBody, upgraderStr + Game.time, 
                {memory: {role: upgraderStr}}))
                console.log('Spawning new upgrader');
        }
        else if(numHealers < roomMem.maxHealers)
        {
            if(OK == hive.spawnCreep(roomMem.healerBody, healerStr + Game.time, 
                {memory: {role: healerStr}}))  
                console.log('Spawning new healer');
        }
        else if(numExplorers < roomMem.maxExplorers)
        {
            if(OK == hive.spawnCreep(roomMem.explorerBody, explorerStr + Game.time, 
                {memory: {role: explorerStr}})) 
                console.log('Spawning new Explorer');
        }
        else if(numAttackers < roomMem.maxAttackers)
        {
            if(OK == hive.spawnCreep(roomMem.attackerBody, attackerStr + Game.time, 
                {memory: {role: attackerStr}})) 
                console.log('Spawning new Attacker!');
        }
    }
};

module.exports = creepController;
