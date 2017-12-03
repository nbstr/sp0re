//Widget sideMenu
var sideMenu = angular.module("sideMenuWidget",[]);

//constant
sideMenu.constant("sideMenuLocal",{
	"template":"html/sideMenu.html"
});
//preload template once for all
sideMenu.run(['$rootScope','$http','$templateCache','sideMenuLocal',function($rootScope,$http,$templateCache,local) {
	$http.get(local.template, { cache: $templateCache });
}]);

//controller
sideMenu.controller("SideMenuController",['$scope','$rootScope','$http','$timeout',function($scope,$rootScope,$http,$timeout){
	//__Constructor
	$scope.init=function(){

	};
	$scope.init();
}]);

sideMenu.service("sideMenuService",[function(){
	var self=this;

	self.STATUS_CLOSED="closed";
	self.STATUS_OPEN="open";

	self.status;

	self.open=function(){
		self.status=self.STATUS_OPEN;
	}
	self.close=function(){
		self.status=self.STATUS_CLOSED;
	}
	self.getStatus=function(){
		return self.status;
	}
    self.isOpen=function(){
        return self.status==self.STATUS_OPEN;
    }
	//init (closed)
	self.close();
}]);

//directive
sideMenu.directive("sideMenu", ['$rootScope', 'sideMenuLocal', '$timeout','sideMenuService', function($rootScope, local, $timeout,sideMenuService) {
    return {
        restrict: 'AE',
        controller: 'SideMenuController',
        templateUrl: local.template,
        scope:{
        	"menuOptions":"="
        },
        transclude: true,
        link: function(scope, element, attrs) {
        	
        	//width of the menu when clicking on the small border on the left
        	var openingMenuWidth=20;
        	// dragEnvironment
            var frameX, dragX, initX;
            var dragging = false;
            var disableTouch = false;


            // event functions
            var showMenu=function(e){
            	startDragging(e);

            	e = e.originalEvent || e;
            	var windowW=angular.element(window).width();
            	var clientX=(e.touches) ? e.touches[0].clientX : e.clientX;
            	if(options.sign>0)
            		initX=Math.max(windowW,clientX+openingMenuWidth);
            	else
            		initX=Math.min(clientX-openingMenuWidth,0);
            	whileDragging(e,true);
            	//setLayerStyle(1-(openingMenuWidth/frameX));
            	e.stopImmediatePropagation();
            	e.preventDefault();
            }

            //Start dragging 
            var startDragging = function(e) {
                if (!disableTouch) {
                    dragging = true;
                    //to compute proportion
                    frameX = angular.element(window).width()*options.menuWidth;
                }
            };

            //Stop
            var stopDragging = function(e) {
                if (dragging && !disableTouch) {
                    // analysing results and taking actions when the dragging is stopped
                    dragging = false;
                    initX = null;
                    if (dragX!=undefined && dragX!=null) {

                        sideMenuWidget.addClass('animated');
                        $timeout(function(){
                        	setLayerStyle(dragX < defaults.closeMenuLimit ? sideMenuService.STATUS_OPEN : sideMenuService.STATUS_CLOSED);
                        	//very important or impossible to close using background
                        	dragX=undefined;
                        })
                    }
                }
            };

            //Dragging function
            var whileDragging = function(e,letAnim) {
                // watching for changes while the user is dragging
                if (dragging) {
                	if(!letAnim){
                		//remove animation while dragin
                		sideMenuWidget.removeClass('animated');
                	}	
                    // mouse or finger
                    e = e.originalEvent || e;
                    // mouse or finger again
                    if (e.touches) {
                        if (initX==undefined || initX==null) {
                            initX = e.touches[0].clientX;
                        }
                        dragX = (e.touches[0].clientX - initX) / frameX;
                    } else {
                        if (initX==undefined || initX==null) {
                            initX = e.clientX;
                        }
                        dragX = (e.clientX - initX) / frameX;
                    }
                    dragX = options.sign * dragX;

                    //dragX [-∞,∞] to [-1,1] => ratio [0,1]
                    if(sideMenuService.getStatus()==sideMenuService.STATUS_CLOSED){
                    	dragX=Math.min(0,Math.max(-1,dragX))
                    	dragX+=1;
                    }
                    dragX=Math.max(0, Math.min(1,dragX))
                    setLayerStyle(dragX);
                }
            };

            // change style smoothly while moving the mouse/finger
            var setLayerStyle = function(ratio) {
                // ratio [0,1] or open/closed
                if(ratio==sideMenuService.STATUS_OPEN){
                	sideMenuService.open();
                	ratio=0;
                }
                if(ratio==sideMenuService.STATUS_CLOSED){
                	//close function menu
                	sideMenuService.close();
                	ratio=1;
                }
                //decal menu
                menuWrap.css('transform',"translateX("+(options.sign * ratio) * 100 + '%)');
                //style of the background
                background.css({
                    'opacity': defaults.backgroundOpacity * (1-ratio),
                    'visibility': ratio < 1 ? 'visible' : 'hidden'
                });
                //$rootScope.blurAppWrapper(defaults.blurRadius * ratio);
            };	
            // WIDGET CONSTRUCTOR

            // style
            var defaults = {
            	//not used yet
                blurRadius: 8,
                menuWidth: 0.8,
                closeMenuLimit: 0.4,
                backgroundOpacity: 0.7,
                //set the top of the overlay at top
                top:0,
                //-1 for left, 1 for right
                sign:1
            };

            var options=angular.extend(defaults,scope.menuOptions);

            // elements
            var sideMenuWidget = element.find(".side-menu");
            var menuWrap = element.find(".side-menu-wrap");
            var background = element.find(".background")
            var menuOpener = element.find(".side-menu-opener");
            
            //USE OPTIONS
            //1. general design option
            if(options.sign==1)
            	sideMenuWidget.addClass("right-menu");
            if(options.top){
            	menuWrap.css("top",options.top);
            	background.css("top",options.top);
            }
            //could add other design modifications
            sideMenuWidget.addClass('animated');

  
            // bind events
            //background close function (priority 1)
            background.bind("click",function(e){
            	$rootScope.closeMenu();
            	e.preventDefault();
            });
            //1. opener
            menuOpener.bind("mousedown touchstart",showMenu);
            //2. mover
            element.bind('mousedown touchstart', startDragging);
            angular.element(window).bind('mouseup touchend', stopDragging);
            element.bind('mousemove touchmove', whileDragging);


            //Global menu functions
            $rootScope.openMenu=function(){
            	sideMenuWidget.addClass('animated');
            	setLayerStyle(sideMenuService.STATUS_OPEN);
            }
            $rootScope.closeMenu=function(){
            	sideMenuWidget.addClass('animated');
            	setLayerStyle(sideMenuService.STATUS_CLOSED);
            }
            $rootScope.toggleMenu=function(){
            	if(sideMenuService.isOpen())
            		$rootScope.closeMenu();
            	else
            		$rootScope.openMenu()
            }
        }
    };
}]);

