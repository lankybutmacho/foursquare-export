# Setup

1. Export your Foursquare data by clicking "Export My Data" at <https://foursquare.com/settings/privacy>
2. Copy checkins.json into this project's directory
3. Create a file called config.js with your Foursquare client ID and secret in this format:

   ```
   module.exports = {
     FOURSQUARE_CLIENT_ID: 'YOUR CLIENT ID',
     FOURSQUARE_CLIENT_SECRET: 'YOUR CLIENT SECRET',
   };
   ```

# Run

`node getVenues.js`