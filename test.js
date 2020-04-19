var set_ip_address = require('set-ip-address')
const child_process = require("child_process");
 
// var enp3s0 = {
//   interface: 'enp3s0',
//   ip_address: '192.168.0.40',
//   prefix: 24,
//   gateway: '192.168.0.1',
//   nameservers: ['1.1.1.1']
// }
 
var enp3s0 = {
  interface: 'enp3s0',
  dhcp: true
}

set_ip_address.configure([enp3s0]).then(() => console.log('done writing config files'))
child_process.exec("sudo netplan apply" , function(err, stdout,stderr){});