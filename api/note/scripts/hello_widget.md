# Hello widget
--------------

this file explains what happens when a visitor comes to a website and sees a widget.

## chapter 1 : first time
the first time,
- we show the bubble with a notification-like red dot on it. we do this to invite the user to click
on the bubble and at least notice it and know that it is clickable. the red dot comes with the idea
that there is some kind of message.
- we also show a message such as "Do you have any questions ? Visitors on this website are here to
help ! 😊". this way the user can know exactly what's happening.
- when he opens Hey, the same message is displayed on the home screen.
- we also need to store the time the user clicked the bubble. This way, if he comes back on that page
or any other that has the widget, we won't bother him again and again with a red dot a message etc.
- we need to store that in the browser.

## chapter 2 : next times
- we compare the last time we showed the bubble and if it was at least {time} (1 day) ago, show it again
- we will also show it a maximum amount of times. If the user clicks 3 times on the bubble, we don't
show it to him anymore.