export default function setImmediate(callback, ...args) {
	var channel = new MessageChannel();
	channel.port1.onmessage = function() {
		callback(...args);
	};
	channel.port2.postMessage(null);
}