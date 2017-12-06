import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {Button} from '@storybook/react/demo';

const MyButton = (props) => <div className="my-button"><Button {...props}/></div>;


storiesOf('Red rocket tests', module)
	.add('with text', () =>
		<div id="red-rocket-start">
			<Button onClick={getTestInfo}>Hello Button</Button>
			<Button onClick={getTestInfo}>Hello Button</Button>
			<MyButton onClick={getTestInfo}>My Button</MyButton>
		</div>
	)
	.add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>);

/*
	TODO: Сергей тебе тут мы будем трасформировать наш путь в xpath
	можешь побаловаться с js по работе со строками но для начала вставь пути оригинальные
	и пути x path сюда в комментарии
 */
const xPathTransform = (path) => {
	return path;
};

const getTestInfo = (event) => {
	if (event === undefined) event = window.event;                     // IE hack
	let target = 'target' in event ? event.target : event.srcElement; // another IE hack

	let root = document.compatMode === 'CSS1Compat' ? document.documentElement : document.body;
	let mxy = [event.clientX + root.scrollLeft, event.clientY + root.scrollTop];

	let path = getPathTo(target);
	let txy = getPageXY(target);
	action('Clicked element')(
		{
			xpath: xPathTransform(path),
			coordinates: {
				x: mxy[0] - txy[0], y: mxy[1] - txy[1]
			}
		});
};

function getPathTo(element) {
	if (element.id !== '')
		return 'id("' + element.id + '")';
	if (element === document.body)
		return element.tagName;

	let ix = 0;
	let siblings = element.parentNode.childNodes;
	for (let i = 0; i < siblings.length; i++) {
		let sibling = siblings[i];
		if (sibling === element)
			return getPathTo(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
		if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
			ix++;
	}
}

function getPageXY(element) {
	var x = 0, y = 0;
	while (element) {
		x += element.offsetLeft;
		y += element.offsetTop;
		element = element.offsetParent;
	}
	return [x, y];
}