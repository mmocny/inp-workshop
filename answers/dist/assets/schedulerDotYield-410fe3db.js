function t(e,...s){var n=new MessageChannel;n.port1.onmessage=function(){e(...s)},n.port2.postMessage(null)}async function o(){return new Promise(e=>{t(e)})}export{o as s};
