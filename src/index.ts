import { Kaiware } from '@nothing-special/kaiware-lib/lib';

let kaiware: Kaiware | null = null;

async function start() {
	kaiware = new Kaiware({
		deviceId: 'my-device',
		deviceName: 'My Device',
		address: '192.168.0.1',
		port: 3000,
		sourceId: 'my-app',
		enableConsoleLogHook: true,
		enableConsoleWarnHook: true,
		enableConsoleErrorHook: true,
		enableGlobalErrorListener: false,
		enableNetworkRequestHook: true
	});
	kaiware.connect();
}

start();

document.querySelector('#send-log-info')?.addEventListener('click', function () {
	kaiware?.log.info('This is an info message');
});
document.querySelector('#send-log-warn')?.addEventListener('click', function () {
	kaiware?.log.warn('This is a warning message');
});
document.querySelector('#send-log-error')?.addEventListener('click', function () {
	kaiware?.log.error(new Error('This is an error message'));
});
document.querySelector('#add-element')?.addEventListener('click', function () {
	addElement();
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

function addElement() {
	const element = document.createElement('div');
	element.textContent = 'New element';
	document.body.appendChild(element);
}
