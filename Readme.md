Pizza Album
===========

This is some quick code that allows me to easily maintain dunlop.pizza. I can add an image to an iOS photos album and have it added to a static html page.

Set Up
------------
2. Copy `config_example.js` to `config.js` and set the secret
1. Use ifttt [New photo added to album](https://ifttt.com/channels/ios_photos/triggers/246-new-photo-added-to-album) Trigger from the iOS Photos Channel
2. Use ifttt to [make a web request](https://ifttt.com/channels/maker/actions/1600703425-make-a-web-request) from the Maker Channel
3. Set the URL to point to his app
4. Set the Content Type to json and set the body to
  ```
    {"date":"{{TakenDate}}","photo_url":"{{PublicPhotoURL}}","secret":"<<insert your own secret here>>"}
  ```
5. Adjust `template/index.html` and `public/style/base.css` as apprpriate

Notes
-------
- graphicsmagick needs to be installed
- All photos are converted to square
- Photos get a white border drawn in them
- Original photos are kept so that they can be reprocessed if needed
