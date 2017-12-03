# DEPLOYING

## EXTENSION
before deploying to production, prepare the extension packs :

### COMMON
• make sure it runs locally
• make sure you set production to 'true' in builder/app/config/general.js
• run 'grunt dev' in builder/ folder
• run ./build.sh

## BACKEND
• upload backend data, to server folder
• ssh in
// ok big problem here for later.
// we should have a backend live dev version
// we also should always be aware of the versionning of everything
• sudo forever stop hey
• cd /root/hey
• sudo sails lift --prod
• if everything is fine,
• ./prod.sh

### CHROME
just go to chrome extension dev dashboard and upload the zip in extension/_chrome/hey.zip
https://chrome.google.com/webstore/developer/dashboard

### FIREFOX
just go to firefox extension dev dashboard and upload the zip in extension/_firefox/hey.zip
https://addons.mozilla.org/en-US/developers/addons

### SAFARI
open extension builder in safari and refresh the package. we'll put that on the store later