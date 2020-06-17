import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import axios from 'axios';
import App from './App';

const errorText = 'Sorry, an error has occurred';

describe('App', () => {
	it('displays the "warm" text if outdoorTemperature is true', async () => {
		axios.get = jest.fn(() => Promise.resolve({ data: { outdoorTemperature: true } }));

		const { getByText, getByAltText } = render(<App />);
		await waitForElement(() => getByText('It\'s warm so go outside!'));
		getByAltText('sun');
	});

	it('displays the "cold" text if outdoorTemperature is false', async () => {
		axios.get = jest.fn(() => Promise.resolve({ data: { outdoorTemperature: false } }));
		
		const { getByText, getByAltText } = render(<App />);
		await waitForElement(() => getByText('It\'s cold so stay inside!'));
		getByAltText('snowman');
	});

	it('displays the error text if no outdoorTemperature exists', async () => {
		axios.get = jest.fn(() => Promise.resolve({ data: { } }));
		
		const { getByText } = render(<App />);
		await waitForElement(() => getByText(errorText));
	});

	it('displays the error text if outdoorTemperature is null', async () => {
		axios.get = jest.fn(() => Promise.resolve({ data: { outdoorTemperature: null } }));
		
		const { getByText } = render(<App />);
		await waitForElement(() => getByText(errorText));
	});
});
