const { lookupGpu, lookupCpu, buildTierCards } = require('./lib/gpuTiers');
const gpuResult = lookupGpu('RTX 5070');
const cpuResult = lookupCpu('Ryzen 7 9700X');
console.log('gpuResult:', JSON.stringify(gpuResult, null, 2));
console.log('tierCards:', JSON.stringify(buildTierCards(gpuResult, cpuResult), null, 2));
