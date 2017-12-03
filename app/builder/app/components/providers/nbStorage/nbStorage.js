//Provider nbStorage
var nbStorage = angular.module("nbStorageModule",[]);

nbStorage.provider("nbStorage",[function(){
	var self=this;

	self.useLocalStorage=true;

	self.data={}

	self.setUseLocalStorage=function(value){
		self.useLocalStorage=value;
	};

	self.$get = [ function() {
		var storage={
			getData:function(key){
				if(self.useLocalStorage){
					try {
					    if(window.localStorage){
							var data=localStorage.getItem(key);
							if(data){
								data=JSON.parse(data);
								return data;
							}
						}
						return undefined;
					}
					catch(err) {
						return self.data[key];
					}
				}
				else{
					return self.data[key];
				}
			},
			saveData:function(key,obj){
				if(self.useLocalStorage){
					try {
					    if(window.localStorage){
							localStorage.setItem(key,JSON.stringify(obj));
						}
						return obj;
					}
					catch(err) {
						//not persistent
						self.data[key]=obj;
						return obj
					}
				}
				else{
					self.data[key]=obj;
					return obj;
				}
			},
			clearData:function(key){
				if(self.useLocalStorage){
					try {
					    if(window.localStorage){
							localStorage.removeItem(key);
							return true;
						}
						return false;
					}
					catch(err) {
						//not persistent
						self.data[key]=undefined;
						return true;
					}
				}
				else{
					self.data[key]=undefined;
					return true;
				}
			}
		}
		return storage;
	}];
}])

nbStorage.run(["$rootScope","nbStorage",function($rootScope,nbStorage){
	/*
	Localstorage
	*/
	$rootScope.saveData=function(key,obj){
        return nbStorage.saveData(helper.localstorage_prefix(key),obj);
    };
    $rootScope.getData=function(key){
        return nbStorage.getData(helper.localstorage_prefix(key));
    };
    $rootScope.clearData=function(key){
		return nbStorage.clearData(helper.localstorage_prefix(key));
	};
}]);