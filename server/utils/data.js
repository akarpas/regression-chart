const calcData = (dataSets) => {
  const totalDataSets = dataSets || 3;
  let data = {};

  for (let i = 0; i < totalDataSets; i++) {
    const serverName = `server_${i + 1}`;
    data[serverName] = [];
    for (let j = 0; j < 15; j++) {
      const set = {
        serverLoad: (Math.random() * 100),
        responseTime: Math.random() + i,
        processingPower: Math.random() + i,
      };
      data[serverName].push(set);
    }
  }
  return data;
}

module.exports = { calcData };