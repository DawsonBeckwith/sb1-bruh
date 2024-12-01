export const PRODUCTION_URL = 'https://provisionpicks.com';
export const PREDICTIONS_PATH = '/predictions';

export const getBaseUrl = () => {
  return window.location.hostname === 'localhost' 
    ? 'http://localhost:5173'
    : PRODUCTION_URL;
};