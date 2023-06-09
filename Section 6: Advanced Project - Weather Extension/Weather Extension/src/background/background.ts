import {
  getStoredCities,
  getStoredOptions,
  setStoredCities,
  setStoredOptions,
} from '../utils/storage';
import { fetchOpenWeatherData } from '../utils/api';

chrome.runtime.onInstalled.addListener(() => {
  setStoredCities([]);
  setStoredOptions({
    hasAutoOverlay: false,
    homeCity: '',
    tempScale: 'metric',
  });

  chrome.contextMenus.create({
    contexts: ['selection'],
    title: 'Add city to weather extension',
    id: 'weatherExtension',
  });

  chrome.alarms.create({
    // periodInMinutes: 60,
    periodInMinutes: 1 / 60, // Updates Every Second
  });
});

chrome.contextMenus.onClicked.addListener((e) => {
  getStoredCities().then((cities) => {
    setStoredCities([...cities, e.selectionText]);
  });
});

chrome.alarms.onAlarm.addListener(() => {
  getStoredOptions().then((options) => {
    const { homeCity, tempScale } = options;

    if (homeCity === '') {
      return;
    }

    fetchOpenWeatherData(homeCity, tempScale).then((data) => {
      const temp = Math.round(data.main.temp);
      const symbol = tempScale === 'metric' ? '\u2103' : '\u2109';

      chrome.action.setBadgeText({
        text: `${temp}${symbol}`,
      });

      // TODO:"CHANGE COLOR BASED ON TEMPERATURE"
      chrome.action.setBadgeBackgroundColor({
        color: 'green',
      });
    });
  });
});
