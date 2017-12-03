//Directive background
var background = angular.module("backgroundModule",[]);

background.directive("background",['$rootScope',function($rootScope){
	return {
        restrict: 'A',
        link: function(scope, element, attrs){
            var func=function(){
                var url;
                if(window.innerWidth>=config.app.tablet_limit){
                    url = attrs.background;
                }
                else if(window.innerWidth>=config.app.phone_limit){
                    if(attrs.backgroundTablet && attrs.backgroundTablet!="")
                        url = attrs.backgroundTablet;
                    else
                        url = attrs.background;
                }
                else{
                    url=attrs.backgroundPhone; 
                }
                url=scope.$eval(url);
                if(url && url!=""){
                    element.css('background-image','url("'+url+'")');
                }
            }
            if(attrs.backgroundPhone || attrs.backgroundTablet){
                $rootScope.resizeFunctions.push(func);
            }

            var watchFunction=function(){
                if( (attrs.backgroundPhone && attrs.backgroundPhone !="") || (attrs.backgroundTablet && attrs.backgroundTablet!="")){
                    func();
                }
                else{
                    var url = attrs.background;
                    url=scope.$eval(url);
                    if(typeof(url)=="object" && url && (url.src || url.url)){
                        url=url.src || url.url;
                    }
                    if(url && url!=""){
                        element.css('background-image','url("'+url+'")');
                    }
                }
            }
            if(!attrs.unwatch){
                var watcher=scope.$watch(attrs.background,watchFunction);
            }
            else {
                watchFunction();
            }
            

            scope.$on("$destroy",function(){
                if(typeof watcher === 'function'){
                    watcher();
                }
            });
        }
        
    };
}]);

