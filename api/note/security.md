#  Chrome Extension - Content Security Policy - executing inline code
## docs   : https://developer.chrome.com/extensions/contentSecurityPolicy
## docs   : https://www.w3.org/TR/2015/CR-CSP2-20150721/#script-src-hash-usage
## source : http://stackoverflow.com/questions/25625412/chrome-extension-content-security-policy-executing-inline-code/38555325#38555325

## Hash usage for <script> elements
    
	# generate sha base64 encrypted inline script and add it to the CSP in manifest.json
	$ echo -n {string} openssl dgst -sha256 -binary | openssl enc -base64

// ARRAY

http://rec.smartlook.com/recorder.js
sha256-dCAtc2hhMjU2IC1iaW5hcnk=

https://rec.smartlook.com/recorder.js
sha256-uGWhfJxEzxu7eIj7cTshQ31hqK8OQLBfogOyYbHexPI=

window.smartlook||(function(d){var o=smartlook=function(){o.api.push(arguments)},h=d.getElementsByTagName('head')[0];var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';c.charset='utf-8';c.src='//rec.smartlook.com/recorder.js';h.appendChild(c);})(document);smartlook('init','3f7e39da24168d0aa3547192aa7797a351dc5a65');
sha256-Ts6r8+0GjlKuORDxF5ABOgKZJjhACgyN1cAwE1Xr09o=

// manifest line
"content_security_policy": "script-src 'self' https://rec.smartlook.com 'sha256-uGWhfJxEzxu7eIj7cTshQ31hqK8OQLBfogOyYbHexPI='; object-src 'self'",
