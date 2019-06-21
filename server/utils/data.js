const calcData = (dataSets) => {
  const totalDataSets = dataSets || 3;
  let data = {};

  for (let i = 0; i < totalDataSets; i++) {

    // Set dynamic server name
    const serverName = `server_${i + 1}`;
    data[serverName] = [];
    for (let j = 0; j < 15; j++) {
      const set = {
        serverLoad: (Math.random() * 100),
        // Add i to make each dataset value a bit larger than previous
        // for presentation reasons
        responseTime: Math.random() + i,
        processingPower: Math.random() + i,
      };
      data[serverName].push(set);
    }
  }
  return data;
}

module.exports = { calcData };