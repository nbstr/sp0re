//Directive noScroll
var noScroll = angular.module("noScrollModule",[]);

noScroll.directive("scrollHandling",['$rootScope',function($rootScope){

    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            // Uses document because document will be topmost level in bubbling
            $(document).on('touchmove',function(e){
                e.preventDefault();
            });
            var selScrollable = '.page-wrapper';

            // Uses body because jQuery on events are called off of the element they are
            // added to, so bubbling would not work if we used document instead.
            $('body').on('touchstart', selScrollable, function(e) {
                if (e.currentTarget.scrollTop === 0) {
                    e.currentTarget.scrollTop = 1;
                } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
                    e.currentTarget.scrollTop -= 1;
                }
            });

            // Prevents preventDefault from being called on document if it sees a scrollable div
            $('body').on('touchmove', selScrollable, function(e) {
                // Only block default if internal div contents are large enough to scroll
                // Warning: scrollHeight support is not universal. (http://stackoverflow.com/a/15033226/40352)
                if($(this)[0].scrollHeight > $(this).innerHeight()) {
                    e.stopPropagation();
                }
            });
        }
    }
}]);
noScroll.directive("noScroll",['$timeout','$rootScope',function($timeout,$rootScope){
    /*----------------------------------------------
    | TO USE ON A ELEMENT
    |
    | disable the propagation of the scroll
    |
    | The parameter given to no-scroll is the element that will be scrolled
    |
    | <div class="wrapper" no-scroll=".content">....
    |   <div class="content">...</div>
    | </div>
    ----------------------------------------------*/
    return {
        restrict: 'A',
        link: function (scope, element, attr) {

            var parent,content;
            parent=element;

            if(attr.noScroll && attr.noScroll!=''){
                content=$(parent.find(attr.noScroll)[0]);
            }
            if(!content || content.length==0){
                content=$(parent.find(">div")[0]);
                if(content.length==0){
                    content=parent;
                }
            }
            //console.log("parent",parent);
            //console.log("content",content);

            /*
            Desktop part (not really usefull here)
            */
            parent.bind('mousewheel DOMMouseScroll', function(e) {
                var direction=0;
                if(e.type=="DOMMouseScroll"){
                    if(e.originalEvent.detail > 0){
                        //down
                        direction=1;
                    }
                }
                if(e.type=="mousewheel"){
                    if(e.originalEvent.wheelDelta  < 0){
                        //down
                        direction=1;
                    }
                }
                //If at the end=>stop propagation (10 is a security)

                if((parent.scrollTop()+parent.innerHeight()+10)>=content.innerHeight() && direction>0){
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
                else if(parent.scrollTop()<=5 && direction==0){
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
                else{
                    parent.css("overflow","auto");
                }
            });
            //mobile part
            
            var velocity=0;
            var amplitude;
            //USE THIS PARAMETER IS YOU WANT TO CONTROLL THE SCROLL
            var amplitudeParameter=0.017;
            //other important constant
            var timeConstant=325;
            //var 
            var pressed = false;
            //starting point
            var reference;
            //use by the scroll function
            var rapp=1;
            //starting timestamp
            var timestamp;

            var ypos=function(e) {
                // touch event
                if (e.touches && (e.touches.length >= 1)) {
                    return e.touches[0].pageY;
                }
             
                // mouse event
                return e.pageY;
            };
            var scroll=function(dy) {
                //condition
                var dist=Math.round(dy*rapp);
                var remainingScroll=(content.innerHeight()-(parent.innerHeight()+parent.scrollTop()));
                //if( !((remainingScroll<=0 && dist>0) || (parent.scrollTop()==0 && dist<0)) ){
                if( ( remainingScroll > 0 || dist<=0) && (parent.scrollTop()!=0 || dist>=0 ) ){
                    parent.scrollTop(parent.scrollTop()+(Math.round(dy*rapp)));
                }
            };
            var autoScroll=function(){
                var elapsed, delta;
                if (amplitude) {
                    elapsed = Date.now() - timestamp;
                    delta = - amplitude * Math.exp(-elapsed / timeConstant);
                    if (delta > 1 || delta < -1) {
                        scroll(-delta);
                        window.requestAnimationFrame(autoScroll);
                    } else {
                        scroll(0);
                    }
                }
            };
            //event functions
            var tap=function(ev){
                var e = ev.originalEvent;
                pressed = true;
                reference = ypos(e);
                amplitude=0;
                timestamp = Date.now();
                velocity=0;
                console.log("tap")
            };

            var drag=function(ev){
                var e = ev.originalEvent;

                var y, delta;
                if (pressed) {
                    y = ypos(e);
                    delta = reference - y;
                    if (delta > 2 || delta < -2) {
                        reference = y;
                        scroll(delta);
                        var now=Date.now();
                        elapsed = now - timestamp;
                        timestamp = now;
                        var v = 1000 * delta / (1 + elapsed);
                        velocity = 0.8 * v + 0.2 * velocity;
                    }
                }
                e.preventDefault();
                return false;
            }
            var release=function(ev){
                var e = ev.originalEvent;
                if(pressed){
                    pressed = false;
                    if (velocity > 100 || velocity < -100) {
                        amplitude = amplitudeParameter * velocity;

                        timestamp = Date.now();
                        window.requestAnimationFrame(autoScroll);
                    }
                }
            }
            parent.on("touchstart",tap);
            parent.on("touchmove",drag);
            parent.on("touchend",release);
        }
    }
}]);



