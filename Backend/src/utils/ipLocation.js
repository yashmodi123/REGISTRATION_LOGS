const axios = require('axios');

const getIpLocation = async (ip) => {
  try {
    if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.')) {
      return { country: 'Localhost', latitude: null, longitude: null };
    }
    
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    if (response.data.status === 'success') {
      return {
        country: response.data.country,
        latitude: response.data.lat,
        longitude: response.data.lon
      };
    }
    return { country: null, latitude: null, longitude: null };
  } catch (error) {
    console.error('Error fetching IP location:', error.message);
    return { country: null, latitude: null, longitude: null };
  }
};

module.exports = { getIpLocation };
