##Small description

Allows to attach several resize functions to the window inside an array : 

```
$rootScope.resizeFunctions
```
To add a function, simply do:

```
$rootScope.resizeFunctions.push(you_function)
```

#Usage

To apply on the body (jade)

```
body(resize)
```