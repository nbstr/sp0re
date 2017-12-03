# BOOT PROCESS

This part will describe the whole process point by point of the app's booting.

1. js injection
	
	1. widget : a script tag in the head will inject the hey.js script
	2. extension : the extension will inject hey.js script (manifest.json)

2. css injection

	1. widget : some javascript code will dynamically inject the css file
	2. extension : the extension will inject the css file (manifest.json)

3. parent check && already injected

	this is the part where we check first if we are in the parent window and if the extension has already
	been bootstrapped. We have to check the dom otherwise it may not work as the script may run several
	times (safari).

	// it would be cool if we could prioritize here (like extension before widget)

4. we set up the communication between the iframe and the injected script by events.