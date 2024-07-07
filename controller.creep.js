require('prototype.creep');

var creepController = {

    /** @param {Room} room **/
    run: function(creep)
    {
        // This is where we do things once per creep

        console.log('Running Creep:' + creep)
        // Work creep work
        if(creep.memory.role == 'harvester')
        {
            if(creep.memory.isFilling)
            {
                creep.mineClosestEnergy();
                if(creep.store.getFreeCapacity() == 0)
                    creep.memory.isFilling = false;
            }
            else 
            {
                // try dump energy
                if(!creep.tryDumpEnergy())
                {
                    creep.tryBuildStructure();
                }
                
                if(creep.store.getUsedCapacity() == 0)
                    creep.memory.isFilling = true;
            }
        }
        else if(creep.memory.role == 'upgrader')
        {
            if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) 
            {
                creep.memory.upgrading = false;
                creep.say('🔄 harvest');
            }
            
            if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) 
            {
                creep.memory.upgrading = true;
                creep.say('⚡ upgrade');
            }
    
            if(creep.memory.upgrading) 
            {
                creep.moveAndUpgradeController();
            }
            else 
            {
                creep.getEnergyFromContainer();
            }
        }
        else if(creep.memory.role == 'builder')
        {
            if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.building = false;
                creep.say('🔄 harvest');
            }
            if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
                creep.memory.building = true;
                creep.say('🚧 build');
            }

            if(creep.memory.building) 
            {
                creep.tryBuidStructure();
            }
            else
            {
                creep.mineClosestEnergy();
            }
        }
        else if(creep.memory.role == 'healer')
        {
            if(creep.memory.patient)
            {
                var patient = Game.getObjectById(creep.memory.patient);
                //creep.say('❤  Healing' + patient.structureType);
                
                if (creep.memory.patient == null || creep.store[RESOURCE_ENERGY] == 0)
                {
                    //console.log("HEALED!");
                    creep.memory.patient=null;
                }
                else
                {
                    // Heal patient
                    //console.log('Heading to: ' + patient);
                    if(creep.repair(patient) != OK) 
                    {
                        creep.moveTo(patient, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                    
                    if(patient.hits == patient.hitsMax)
                    {
                        const targets = creep.room.find(FIND_STRUCTURES);
                        targets.sort((a,b) => (b.hitsMax - b.hits) - (a.hitsMax - a.hits));
                        creep.memory.patient = targets[0].id;
                    }
                }
            }
            else
            {
                //creep.say('🔄 harvest');
                
                if (creep.store.getFreeCapacity() == 0)
                {
                    const targets = creep.room.find(FIND_STRUCTURES);
                    targets.sort((a,b) => (b.hitsMax - b.hits) - (a.hitsMax - a.hits));
                    creep.memory.patient = targets[0].id;
                }
                else
                {
                    creep.mineClosestEnergy();
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
        const numHarvesters = 5;
        const numBuilders = 0;
        const numHealers = 1;
        const numUpgraders = 4;
        
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
            hive.spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName, 
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
            hive.spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
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