#Documentation for ngRepeatCallback

##Description

...

##Usage

### HTML
	<div ng-repeat="item in items" ng-repeat-callback="ngRepeatFinished">
	    <div>{{item.name}}<div>
	</div>

### JS NG CTRL
	$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
	    // ngRepeatFinishedEvent : event object
	    // do stuff, execute functions, whatever...
	});

