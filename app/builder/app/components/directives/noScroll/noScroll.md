##Small description

disable the propagation of the scroll

The parameter no-scroll is the wrapper where you want to scroll without propagation while the "long" element that will be scrolled is called .content (if you don't use the class .content, the first div child will be taken)
##Usage(jade)

```
.wrapper
	.content(no-scroll=".wrapper")
```
