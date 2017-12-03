//should not append
if (!config) {
    var config = {
    	app:{}
    };
}
var custom_config = {
	//custom confif here
};

for (var key in custom_config) {
    config.app[key] = custom_config[key];
}