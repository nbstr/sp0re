#Documentation for genericInfiniteScroll

Generic infinite scroll function linked to resources

##Description

provide an object of this form to the directive

{
	"resource":"...", //the resource service
	"func":"...", // The get function of the resource,
	"fake":true/false //want to use fake_data ?
	"fake_data":[...] //required with fake
	"scopeDataName": ... //the name of the variable that will be added to the scope
	"attachLoading":"..." //whether or not a custom loading will be attached to the directive
	"useMaterial":true/false //DEPRECATED => use genericInfiniteScroll instead
	"params":{ //the parameters to provide to the get request (offset and limit are automatically added)
		'limit':"...",
		'offset':"...."
	},
	"postTreatment":"..."//the name of a function of the scope of the directive doing a postreatment on the data returned
}

This will create some variables in the scope accessible in the html/jade
 - results : the results
 - loaded : a variable telling if at least one request has been done

##Usage

<page-wrapper generic-infinite-scroll="scope_object">

</page-wrapper>


