//Directive nbTabs
var nbTabs = angular.module("nbSwipeModule",[]);

nbTabs.directive("nbSwipe",['$rootScope','$timeout','$interval','$animate',function($rootScope,$timeout,$interval,$animate){
	return {
		restrict: 'A',
		link: function(scope,element,attrs) {

			var watcher=scope.$watch(attrs.nbSwipe,function(swipes){
				if(!swipes){
					return false;
				}
				scope.current_tab_active=parseInt(attrs.activeTab) || 0;

				//Initialisation
				//1. get the elements wrapper
				var selector_wrapper=attrs.selectorsWrapper || ".nb-swipe-selectors";
				var target_wrapper=attrs.targetsWrapper || ".nb-swipe-contents-wrapper";
				var target_contents=attrs.targetsContents || ".nb-swipe-contents";

				selector_wrapper=$(element.find(selector_wrapper));
				target_wrapper=$(element.find(target_wrapper));
				target_contents=$(element.find(target_contents));
				//2. get the elements
				var selectors=attrs.selectors || ".nb-swipe-selector";
				var targets=attrs.targets || ".nb-swipe-content"
				var indicator=attrs.indicator || ".nb-swipe-indicator";

				selectors=selector_wrapper.find(selectors);
				targets=target_wrapper.find(targets);
				indicator=element.find(indicator);

				//3. style
				var width_selector=100/selectors.length;
				if(!attrs.noSizing)
					selectors.css("width",width_selector+"%");

				target_contents.css("width",(targets.length*100)+"%");
				targets.css("width",(100/targets.length)+"%")
				//4.auto anim
				var time_auto_anim=parseInt(attrs.autoScroll);
				var interval_auto_anim;

				//controll
				var movement_initiated=false,target_width;

				//behavior
				var continue_drag = attrs.continueDrag || false;
				var lock=false;
				//OLD VERSION
				/*
				function actionMove2(options){
					var self=this;
			        //no animatacion
			        if(self.lock)
			            return true;
			        //security
			        if(options.new_index==undefined){
			            alert("you must provide a new index");
			            return true;
			        }
			        var previous,next,previousElem,nextElem;
			        
			   		previous=scope.current_tab_active;
			        if(options.new_index==previous){
			            options.no_init=true;
			        }
			        //get previosu and next elements
			        previousElem=targets.eq(previous);
			        next=options.new_index;
			        nextElem=targets.eq(next);
			        
			        //visual initialisation
			        targets.hide();
			        target_contents.css("width","200%");
			        
			        var width=target_wrapper.width();

			        //visual initialisation
			        nextElem.css("width","50%");
			        nextElem.show();
			        previousElem.css("width","50%");
			        previousElem.show(); 
			        //float reinit
			        if(!options.no_init){
			            previousElem.css("float","left");
			            nextElem.css("float","left");
			        }
			        //moveX indicate distance to do
			        var moveX;
			        if(options.dx!=undefined){
			            moveX=options.dx;
			        }
			        else{
			            moveX=-width;
			            if(next<previous){
			                moveX*=-1;
			                //moveX=0; //(other version with translate)
			            }
			        }
			        if(!options.unidirectional){
			        	if(!options.no_animate && !options.no_init){
			        		//direction to the left
			        		if(next<previous){
			        			target_wrapper.scrollLeft(width);
			        		}
			        	}
			            if(next<0){
			                previousElem.css("float","right");
			            }
			        }
			        else{
			            //allow infinite transitions to the right
			            if(next<previous){
			                nextElem.css("float","right");
			                moveX=0;
			            }
			        }
			        
			        //drag and drop OR animation
			        if(options.no_animate){
			        	var d;
			            if(next>previous){
			            	d=-moveX;
			            	var rapp=-moveX/width;
			            	var current_pos=width_selector*(previous+rapp);
			            	indicator.css("left",current_pos.toString()+"%");
			            }
			            else{
			                d=width-moveX;
			            	var rapp=moveX/width;
			            	var current_pos=width_selector*(previous - rapp)
			            	indicator.css("left",current_pos.toString()+"%");
			            }
			            console.log("moveX",moveX);
			            indicator.css("left",current_pos.toString()+"%");
			            target_wrapper.scrollLeft(d);
			    
			        }
			        else{

			        	self.lock=true;
			            var d=(next>previous)?(-moveX):width-moveX;		      
			            console.log("end move",d);
						selectors.removeClass("active");
		              	selectors.eq(next).addClass("active");

		              	element.addClass("animate");
		              	indicator.css("left",(width_selector*(next))+"%");
		              	var current_scroll_left=target_wrapper.scrollLeft();
		              	var callback_animation=function(){
		              		scope.current_tab_active=options.new_index; 
			                if(next!=previous)
			                	previousElem.hide();

			               	//reset everything
			                target_contents.css("width","100%");
			                targets.css("width","100%");

			                element.removeClass("animate");

			                self.lock=false;
			                //action part
			               	var action=swipes.tabs[scope.current_tab_active].action;
			               	if(action && typeof(action)=='function'){
			               		$timeout(function(){
			               			action();
			               		});
			               	}
		              	}
			            target_wrapper.animate({"scrollLeft":d},300,
			            callback_animation);

			        
			        }
			        launch_auto_anim();
				};
				*/
				function actionMove(options){
					var self=this;

					target_width=targets.width();

			        //no animatacion
			        if(lock)
			            return true;
			        //security
			        if(options.new_index==undefined){
			            alert("you must provide a new index");
			            return true;
			        }
			        var previous,next,previousElem,nextElem;
			        
			   		previous=scope.current_tab_active;
			       
			        //get previosu and next elements
			        previousElem=targets.eq(previous);
			        next=options.new_index;
			        nextElem=targets.eq(next);
			        	
			        //scroll movement
			        var scrollMovement=next*target_width;	
			        //drag and drop OR animation
			        if(options.no_animate){
			        	if(!movement_initiated)
			        		movement_initiated=true;

			        	var decal=options.dx || 0;

			        	var scrollMovement;
			        	if(next>previous){
			        		scrollMovement=(next - 1)*target_width - decal;
			        		if(!continue_drag)
			        			scrollMovement=Math.min((targets.length-1)*target_width,scrollMovement);
			        	}
			        	else if(next<previous){
			        		scrollMovement=((previous*target_width) - decal);
			        		if(!continue_drag)
			        			scrollMovement=Math.max(scrollMovement,0);
			        	}
			        }
			        else{			        	
			        	selectors.removeClass("active");
		              	selectors.eq(next).addClass("active");
		        
			        	//element.addClass("animate");
		              	lock=true;

			        	//TODO: INDICATOR !!!!
			        	//var rapp=(scrollMovement/target_contents.width());
		              	//indicator.css("left",(width_selector*(next))+"%");

		              	$animate.addClass(element,"animation").then(function(){
		              		$timeout(function(){
		              			element.removeClass("animation");
		              			callback_animation(options.new_index)
		              		});
		              	})
			        }
			        $timeout(function(){
			        	//timeout is important because it has to be added after the class !!
			        	target_contents.css("transform","translateX("+(-scrollMovement)+"px)");
			        	target_contents.css("-webkit-transform","translateX("+(-scrollMovement)+"px)");
			        })
			        //launch animation (if asked)
			        launch_auto_anim();
				}
				var callback_animation=function(new_index){
					scope.current_tab_active=new_index;
	                lock=false;
	                movement_initiated=false;
	                //action part
	               	var action=swipes.tabs[scope.current_tab_active].action;
	               	if(action && typeof(action)=='function'){
	               		$timeout(function(){
	               			action();
	               		});
	               	}
	               	$rootScope.$emit("nbswipe:endswipe");
              	};
				//INITIALISATIOn
				$timeout(function(){
					//First selection
					target_width=targets.width();
					target_contents.css("transform","translateX("+(scope.current_tab_active*(-1)*target_width)+"px)");
					selectors.eq(scope.current_tab_active).addClass("active");
					//indicator.css("left",(width_selector*(scope.current_tab_active))+"%");
				});

				//auto scroll part
                var launch_auto_anim=function(){
                    if(interval_auto_anim){
                        $interval.cancel(interval_auto_anim);
                    }
                    if(!time_auto_anim || time_auto_anim<1000){
                    	return false;
                    }
                    interval_auto_anim=$interval(function(){
                    	new_index=scope.current_tab_active+1
                    	if(new_index==targets.length){
                    		new_index=0;
                    	}
	         			actionMove({
	         				"new_index":new_index
	         			})
                    },time_auto_anim);
                }; 
                launch_auto_anim();
				//click part
				$.each(selectors,function(index,value){
					var elem=$(value);
					elem.on("click",function(event){
						if(index==scope.current_tab_active){
							return true;
						}
						actionMove({
							"new_index":index
						});
					})
				});
				 //drag & drop part
            	var paused=false,dragStarted=false;
				var startX,startY,currentX=-1;
                var currentY=-1;
                var startScrollY=-1;
                var dx=0;
                var dy=0;
                var currentY=-1;
                var continueMove=false;
                //NEW !!
                var directionRight,directionLeft;
               	target_wrapper.bind("mousedown touchstart",function(e){
                    if(!dragStarted && !lock){
                    	continueMove=true;
                    	directionLeft=false;
                    	directionRight=false;
                        dragStarted=true;

                        e=e.originalEvent || e;
                        dy=0;
                        //mobile one touch
                        if(e.touches){
                            startX=e.touches[0].pageX;
                            startY=e.touches[0].pageY;
                        }
                        else{
                            startX=e.pageX;
                            startY=e.pageY;
                        }
                        startScrollY=target_wrapper.scrollTop();
                    }
                });
                target_wrapper.bind("mousemove touchmove",function(e){
                    if(dragStarted && continueMove && !lock){
                        e=e.originalEvent || e;
                        if(e.touches){
                            currentX=e.touches[0].pageX;
                            currentY=e.touches[0].pageY;
                        }
                        else{
                            currentX=e.pageX;
                            currentY=e.pageY;
                        }
                        if(startY!=currentY && currentY!=-1){
                            dy=currentY-startY;
                        }
                        if(startX!=currentX && currentX!=-1){
                            dx=currentX-startX;

                            //NEW: avoid stops on the edges !!!!
                            if(scope.current_tab_active==0 && dx<0 && !directionRight)
                            	directionRight=true;
                            else if(directionRight && dx>0){
                            	dx=0;
                            }
                            //avoid stops
                            if(scope.current_tab_active==(targets.length-1) && dx>0 && !directionLeft)
                            	directionLeft=true;
                            else if(directionLeft && dx<0){
                            	dx=0;
                            }
                            //scroll vs swipe

                            var diffY=Math.abs(dy);
                            var diffX=Math.abs(dx);

                            if(diffY>=diffX && !movement_initiated) {
                            	//cancel move
                            	dragStarted=false;
                            	return true;
                            }
                            else{
                            	continueMove=true;
                            }
                            var options={
                                "new_index":scope.current_tab_active+1,
                                "dx":dx,
                                "no_animate":true
                            }
                            if(dx>0)
                                options.new_index=scope.current_tab_active-1;
                            $rootScope.$emit("nbswipe:swiping");
                           	actionMove(options);

                           	e.preventDefault();
                           	return false;


                        }
                    }
                });
                target_wrapper.bind("mouseup touchend",function(e){
                    if(dragStarted && !lock){
                    	e=e.originalEvent || e;
                        dragStarted=false;
                        if(currentX==-1)
                            return true;
                        var totalDx=currentX-startX;
                        var totalDy=currentY-startY;
                        currentX=-1;
                        currentY=-1;
                        //end move
                        if(Math.abs(totalDx)>0){
                            var new_index=(totalDx < 0 )? scope.current_tab_active+1:scope.current_tab_active-1;
                            //console.log(new_index)

                            if(Math.abs(totalDx)>target_wrapper.width()/4 && new_index>=0 && (new_index<targets.length) ){

                                var options={
                                    "new_index":new_index
                                }
                                actionMove(options);

                            }
                            //cancel move
                            else{
                                var options={
                                	"new_index":scope.current_tab_active
                                }
                                actionMove(options);
                            }
                        }
                    }

                });
				watcher();
			});
			scope.$on("$destroy", function() {
                watcher();
            });
		}
	};
}]);

