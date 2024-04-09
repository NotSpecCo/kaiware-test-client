const kaiwareAddressAndPort = '192.168.50.2:3000';

document.querySelector('#send-log-info').addEventListener('click', function () {
	sendLog('info', 'This is an info message');
});
document.querySelector('#send-log-warn').addEventListener('click', function () {
	sendLog('warn', 'This is a warning message');
});
document.querySelector('#send-log-error').addEventListener('click', function () {
	sendLog(
		'error',
		// Errors need to be stringified differently to include all properties
		JSON.stringify(new Error('This is an error message'), [
			'message',
			'type',
			'name',
			'stack',
			'fileName',
			'lineNumber',
			'columnNumber'
		])
	);
});
document.querySelector('#add-element').addEventListener('click', function () {
	addElement();
});
document.querySelector('#send-device-info').addEventListener('click', function () {
	updateDeviceInfo('Banana Phone');
});

const buttons = Array.from(document.querySelectorAll('button'));

document.addEventListener('keydown', function (event) {
	if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;

	const currentIndex = buttons.findIndex((button) => button === document.activeElement);
	let nextIndex = currentIndex;

	if (event.key === 'ArrowUp') {
		nextIndex--;
	} else if (event.key === 'ArrowDown') {
		nextIndex++;
	}

	if (!buttons[nextIndex]) return;
	buttons[nextIndex].focus();
});

/**
 *	Updates connected device info in Kaiware
 *	@param {'info'|'warn'|'error'} level
 *	@param {string} name
 */
function updateDeviceInfo(name = 'Nokia 6300 4G') {
	const message = {
		type: 'device-info-update',
		data: {
			id: 'nokia',
			name
		}
	};
	webSocket.send(JSON.stringify(message));
}

/**
 *	Sends a log message
 *	@param {'info'|'warn'|'error'} level
 *	@param {string} data
 */
function sendLog(level, data) {
	const log = {
		type: 'new-log',
		data: {
			level,
			data,
			source: 'my-app',
			timestamp: new Date().toISOString()
		}
	};
	webSocket.send(JSON.stringify(log));
}

/**
 *	Add an element to the DOM to see it change in Kaiware
 */
function addElement() {
	const element = document.createElement('div');
	element.textContent = 'New element';
	document.body.appendChild(element);
}

const webSocket = new WebSocket(`ws://${kaiwareAddressAndPort}`);

webSocket.onopen = function () {
	console.log('WebSocket connection established');
};

webSocket.onmessage = function (message) {
	console.log('Message received: ', message);
	const data = JSON.parse(message.data);
	if (data.type === 'refresh-elements') {
		webSocket.send(
			JSON.stringify({
				type: 'elements-update',
				data: document.querySelector('html').outerHTML
			})
		);
	} else if (data.type === 'refresh-device-info') {
		updateDeviceInfo();
	}
};

webSocket.onclose = function () {
	console.log('WebSocket connection closed');
};

webSocket.onerror = function (error) {
	console.log('WebSocket error: ', error);
};
