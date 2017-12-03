//Provider nbCaching
var nbCaching = angular.module("nbCachingModule",[]);

nbCaching.provider("nbCaching",function(){	
	var self=this;
	//time to save data
	self.tts=2000;

	self.setTts=function(value){
		self.tts=value;
	}
	//factory
	self.$get = ['nbStorage','$cacheFactory', function($storage,$cacheFactory) {
		var cachingObj=$cacheFactory("cachingData");
		//override
		cachingObj.put=function(key,value){
			var data={
				'date':new Date(),
				'content':value
			}
			console.log("store \""+key+"\"",value);
			$storage.saveData(key,data);
		};
		cachingObj.get=function(key){
			var data=$storage.getData(key);
			console.log("get \""+key+"\"",data);
			if(data){
				if(data.date){
					var time=new Date(data.date).getTime();
					var now=new Date().getTime();
					if(now<(time+self.tts)){
						return data.content;
					}
				}
			}
			console.log("should be a promise after")
			return undefined;
		};
		return cachingObj;
	}];
});

