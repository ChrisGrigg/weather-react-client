import React, { useState, useEffect } from 'react';
import './App.css';
import sunLogo from './HappySun.svg';
import snowmanLogo from './Snowman.svg';
import axios from 'axios';

function useWeatherAPI() {
	const [outdoorTemperature, setOutdoorTemperature] = useState(null);
	const [weatherText, setWeatherText] = useState('');
	const [hasError, setErrors] = useState('');

    useEffect(() => {
        // Basic implementation to handle race conditions
        // When component might unmount before API call finishes   
        // https://overreacted.io/a-complete-guide-to-useeffect/#speaking-of-race-conditions
        let isStopped = false;
        if (!isStopped) {
            const getWeather = async () => {
				try {
					const { data: { outdoorTemperature: temperature } } = await axios.get(
						'https://mjlmap9ys3.execute-api.ap-southeast-2.amazonaws.com/development/weather/main?city=London'
					);
					if (!isStopped && typeof temperature !== undefined) {
						setOutdoorTemperature(temperature);
						if (temperature) {
							setWeatherText('It\'s warm so go outside!');
						} else {
							setWeatherText('It\'s cold so stay inside!');
						}
					}
				} catch (error) {
					setErrors(error);
				}
            }
            getWeather();
        }
        return () => {
            isStopped = true;
        }
    }, [])
    return { 
		outdoorTemperature, weatherText, hasError
	}
}

function App() {
	const { outdoorTemperature, weatherText, hasError } = useWeatherAPI();

	function handleError(error) {
		// TODO: send error to error logging such as Azure Application Insights
		// sendToAppInsights(error);
		// then create user friendly DOM element
		return <span>Sorry, an error has occurred</span>
	}

	return (
		<div className='App'>
			<header className='App-header'>
				{(weatherText !== '' && !hasError)
				?
					<>
						<img src={outdoorTemperature ? sunLogo : snowmanLogo} className='App-logo' alt={outdoorTemperature ? 'sun' : 'snowman'} />
						<p>{weatherText}</p>
					</>
				:
					handleError(hasError)
				}
			</header>
		</div>
	);
}

export default App;
