# Setup

1. `npm install`
2. Export your Foursquare data by clicking "Export My Data" at <https://foursquare.com/settings/privacy>
3. Copy checkins.json into this project's directory
4. Create a file called config.js with your Foursquare client ID and secret in this format:

   ```
   module.exports = {
     FOURSQUARE_CLIENT_ID: 'YOUR CLIENT ID',
     FOURSQUARE_CLIENT_SECRET: 'YOUR CLIENT SECRET',
   };
   ```

# Run

`node getVenues.js`
