const axios = require("axios");
require('dotenv').config();

const { login } = require("tplink-cloud-api");


const runner = async function() {
  const tplink = await login(process.env.KasaUsername, process.env.KasaPassword);
  const deviceList = await tplink.getDeviceList();

  const gsibesthour = await axios.get("http://api.corrently.io/v2.0/gsi/bestHour?zip=" + process.env.Postleitzahl);
  /*
    gsibesthour.data = true/false
  */
  for(let i=0;i<deviceList.length;i++) {
    if(gsibesthour.data) {
      await tplink.getHS100(deviceList[i].alias).powerOn();
    } else  {
      await tplink.getHS100(deviceList[i].alias).powerOff();
    }
    console.log(new Date().toLocaleString(),deviceList[i].alias,gsibesthour.data);
  }
}

setInterval(runner,900000);
runner();
