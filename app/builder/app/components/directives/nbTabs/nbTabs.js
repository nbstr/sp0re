//Directive nbTabs
var nbTabs = angular.module("nbTabsModule",[]);

nbTabs.directive("nbTabs",['$rootScope',function($rootScope){
	return {
		restrict: 'A',
		link: function(scope,element,attrs) {

			var time=350;

			var watcher=scope.$watch(attrs.nbTabs,function(tabs){
				if(!tabs){
					return false;
				}
				var current_active;
				//0. get the activated element
				var activated_element=attrs.activated_element || 0;
				//1. get the elements wrapper
				var selector_wrapper=attrs.selectorsWrapper || ".nb-tabs-selectors";
				var target_wrapper=attrs.targetsWrapper || ".nb-tabs-contents";

				selector_wrapper=$(element.find(selector_wrapper));
				target_wrapper=$(element.find(target_wrapper));

				//2. get the elements
				var selectors=attrs.selectors || "..nb-tabs-selector";
				var targets=attrs.targets || ".nb-tabs-content"
				var indicator=attrs.indicator || ".nb-tabs-arrow";

				selectors=selector_wrapper.find(selectors);
				targets=target_wrapper.find(targets);
				indicator=element.find(indicator);

				//3. style
				var width=100/selectors.length;
				selectors.css("width",width+"%");

				$.each(selectors,function(index,value){
					var elem=$(value);
					elem.on("click",function(event){
						if(index==current_active){
							return false;
						}
						var old_active=targets.eq(current_active);
						old_active.css("position","absolute");
		
						current_active=index;
						targets.fadeOut(time);
						var target=targets.eq(index);

						target.fadeIn(time,function(){
							old_active.css("position","relative");
						});
						indicator.css("left",(width*(index+1/2))+"%");
					})
				});
				targets.eq(activated_element).show();
				indicator.css("left",(width*(activated_element+1/2))+"%");
				current_active=0;

			});
			scope.$on("$destroy", function() {
                watcher();
            });
		}
	};
}]);

