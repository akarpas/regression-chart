const calcData = (dataSets) => {
  const totalDataSets = dataSets || 3;
  let data = {};

  for (let i = 0; i < totalDataSets; i++) {

    // Set dynamic server name
    const serverId = `server_${i + 1}`;
    data[serverId] = [];
    for (let j = 0; j < 15; j++) {
      const set = {
        serverLoad: (j * 2 + 20),
        // Add i to make each dataset value a bit larger than previous
        // for presentation reasons
        responseTime: Math.random() + j + (i * 3.5) + (Math.random() < 0.5 ? -1 : 1.2),
        processingPower: Math.random() + ((i + 1) * 3 + (Math.random() < 0.5 ? -0.25 : 0.5)),
      };
      data[serverId].push(set);
    }
  }
  return data;
}

module.exports = { calcData };