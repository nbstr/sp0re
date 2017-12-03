//Service sharedData
var sharedData = angular.module("sharedDataModule",[]);

sharedData.service("sharedData",['$resource','$http', '$q','$timeout',function($resource,$http,$q,$timeout){
	//sharedData Service
	var self=this;
    self.getData=function (key) {
        return self[key];
    };
    self.saveData=function(key,value) {
    	self[key]=value;
    };
    self.clearData=function(key) {
        self[key]=undefined;
    };
    self.clear=function(){
    	for(var key in self){
    		if(key != "getData" && key != "saveData" && key != "clear" && key != "clearData"){
    			self[key]=undefined;
    		}
    	}
    };
}]);

