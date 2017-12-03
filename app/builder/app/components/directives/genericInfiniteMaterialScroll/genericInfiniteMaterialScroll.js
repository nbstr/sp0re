//Directive genericInfiniteMaterialScroll
var genericInfiniteMaterialScroll = angular.module("genericInfiniteMaterialScrollModule",[]);

genericInfiniteMaterialScroll.directive("genericInfiniteMaterialScroll",['$rootScope','$timeout','$q','$injector',function($rootScope,$timeout,$q,$injector){
	return {
        restrict: 'A',
        link: function(scope,element,attrs) {
            //get the corresponding resource !!!v
            var watchFunc=function(config){
            	
            	if(!config){
            		return false;
            	}
            	var scope_data_name=config.scopeDataName || "data";

            	var attach_loading=config.attachLoading || false;

            	var resource,func;
            	if(!config.fake){
            		resource=$injector.get(config.resource);
		            if(!resource){
		                alert("provide a resource");
		            }
		            //attach the get function
		            func=config.func || 'query';
	        	}
	        	if(!scope[scope_data_name])
	        		scope[scope_data_name]={};
	        	//data paramaters
	            if(config.params){
	            	scope[scope_data_name].searchData=helper.clone(config.params);
	            }
	            if(!scope[scope_data_name].searchData)
	            	scope[scope_data_name].searchData={};
	            //default limit
	            if(!scope[scope_data_name].searchData["limit"])
	                scope[scope_data_name].searchData["limit"]=1;
	            scope[scope_data_name].searchData.offset=0;

	            scope[scope_data_name].continueLoad=true;


	            //load data from the server (query functions)
	            var load=function(data_result_name){	            	
	            	if(!scope[scope_data_name].continueLoad)
	            		return false;
	            	if(scope[scope_data_name].isCharginData)
	            		return false;
	            	scope[scope_data_name].isCharginData=true;

	            	if(!data_result_name)
	            		data_result_name="data_";
	            		                
	                var deferred=$q.defer();
	                if(attach_loading){
	                	$rootScope.backgroundLoading();
	                }
	                scope[scope_data_name].loading=true;
	                var callback=function(resp){
	                	if(attach_loading){
		                	$rootScope.resetLoading();
		                }
		                scope[scope_data_name].loading=false;
	                    if(!resp.error){
	                        if(resp.elements.length<scope[scope_data_name].searchData["limit"]){
	                          	scope[scope_data_name].continueLoad=false;
	                        }

	                        var res=helper.clone(resp.elements);
	                        //treatment res
	                        if(config.treatmentRes){
				            	res=config.treatmentRes(res);
	                        }

	                        if(scope[scope_data_name][data_result_name].length==0){
		                   		scope[scope_data_name][data_result_name]=res;
	                        }
	                        else{
	                        	for(var i=0;i<res.length;i++){
	                        	    scope[scope_data_name][data_result_name].push(res[i]);
	                        	}
	                    	}
	                        scope[scope_data_name].searchData["offset"]+=scope[scope_data_name].searchData["limit"];

	                        //post treatment general
				            if(config.postTreatment){
				            	config.postTreatment(scope[scope_data_name][data_result_name]);
	                        }

	                        deferred.resolve(scope[scope_data_name][data_result_name]);
	                        if(!scope[scope_data_name].loaded){
		                    	scope[scope_data_name].loaded=true;
		                    }
	                    }
	                    else{
	                        deferred.reject();
	                    }
	                    if(config.fake && scope[scope_data_name][data_result_name].length>100){
	                    	scope[scope_data_name].continueLoad=false;	
	                    }
	                    if(config.callback && typeof(config.callback)=="function"){
	                    	config.callback(resp);
	                    }
	                    scope[scope_data_name].isCharginData=false;
	                };
	                if(!config.fake){
	                	resource[func](scope[scope_data_name].searchData,callback);
	            	}
	            	else{
	            		if(!attach_loading){
	            			$rootScope.loading();
	            		}
	            		$timeout(function(){
	            			var resp={
	            				"elements":config.fake_data || [],
	            				"error":false
	            			}
	            			callback(resp);
	            			if(!attach_loading)
	            				$rootScope.loaded();
	            		},1000)
	            	}
	                return deferred.promise;
	            };


	        	//material design structure
	            var material_design_structure={
	            	toLoad_: 0,
		            data_:[],
		            isFetching:false,
		          	// Required.
		          	getItemAtIndex: function(index) {
		            	if (index >= this.data_.length && !this.isFetching) {
		              		this.fetchMoreItems_();
		              		return false;
		            	}
		            	return this.data_[index];
		          	},
					// Required.
					// For infinite scroll behavior, we always return a slightly higher
					// number than the previously loaded items.
					getLength: function() {
						return this.data_.length + 1;
					},
					fetchMoreItems_: function() {
						var self=this;
						self.isFetching=true;
						$timeout(function(){
							var fetchingFunc=load();
							if(fetchingFunc){
								fetchingFunc.then(function(){
									self.isFetching=false;
								});
							}
						});
					}
	            };
	            for(var key in material_design_structure){
	            	scope[scope_data_name][key]=material_design_structure[key];
	            }
	            $timeout(function(){
	            	scope[scope_data_name].isFetching=true;
					$timeout(function(){
						var fetchingFunc=load();
						if(fetchingFunc){
							fetchingFunc.then(function(){
								scope[scope_data_name].isFetching=false;
							});
						}
					});
	            })
        	}
        	var watcher=scope.$watch(attrs.genericInfiniteMaterialScroll,watchFunc,true);
        	scope.$on("$destroy",function(){
        		watcher();
        	});
        }
    };
}]);

