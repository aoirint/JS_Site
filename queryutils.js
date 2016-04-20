
function getQueries()
{
	var queries = new Array();
	
	if(1 < window.location.search.length)
	{
		var params = window.location.search.substring(1).split('&');

		for(var i=0; i<params.length; ++i)
		{
			var elm = params[i].split('=');
			queries[decodeURIComponent(elm[0])] = decodeURIComponent(elm[1]);
		}
	}

	return queries;
}

function arrayToQueryString(queryAry)
{
	var result = '';
	var first = true;
	
	for (key in queryAry)
	{
		if (queryAry[key] == undefined) continue;
		
		result = result + (first ? '' : '&') + key + '=' + queryAry[key];
		first = false;
	}
	
	// console.log("@" + result);
	return result;
}