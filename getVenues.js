const fs = require('fs');
const readline = require('readline');

const axios = require('axios');

const { FOURSQUARE_CLIENT_ID, FOURSQUARE_CLIENT_SECRET } = require('./config.js');

const API_BASE_URL = 'https://api.foursquare.com/v2';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const checkinsJson = fs.readFileSync('checkins.json');

let checkins;
let venues = {};

try {
  checkins = JSON.parse(checkinsJson);
} catch (error) {
  console.error('Hmm, something went wrong parsing checkins.json:');
  console.error(error);
  return;
}

checkins.items.forEach(checkin => {
  if (checkin.venue != null) {
    venues[checkin.venue.id] = null;
  }
});

const getVenue = async venueId => {
  let response;

  try {
    response = await axios.get(`${API_BASE_URL}/venues/${venueId}`, {
      params: {
        client_id: FOURSQUARE_CLIENT_ID,
        client_secret: FOURSQUARE_CLIENT_SECRET,
        v: '20190625',
      },
    });
    return response.data.response.venue;
  } catch (error) {
    console.error('\nWhoops, got an error from the Foursquare API:');
    switch (error.response.status) {
      case 429:
        console.error(error.response.statusText);
        return -1;
      default:
        console.error(error);
    }
    return null;
  }
};

const venueIds = Object.keys(venues);

(async () => {
  while (venueIds.length > 0) {
    rl.write(`Remaining venues: ${venueIds.length}`);
    const venueId = venueIds.pop();
    const response = await getVenue(venueId);

    if (response === -1) return;

    if (response != null) {
      venues[venueId] = response;
    }

    if (venueIds.length > 0) {
      readline.cursorTo(process.stdout, 0);
    }
  }

  const checkinsWithVenues = {
    ...checkins,
    items: checkins.items.map(checkin => {
      const venue = checkin.venue && venues[checkin.venue.id] != null ? venues[checkin.venue.id] : checkin.venue;
      return { ...checkin, venue };
    }),
  };

  fs.writeFile('checkins_with_venues.json', JSON.stringify(checkinsWithVenues), () => console.log('Done!'));

  // fs.writeFile('venues.json', JSON.stringify(venues), () => console.log('Done!'));

  return;
})();
