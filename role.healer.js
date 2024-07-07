var globals = require('globals');

var roleHealer = {

    /** @param {Creep} creep **/
    run: function(creep) {

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
	            globals.mineClosestNode(creep);
	        }
	    }
	}
};

module.exports = roleHealer;