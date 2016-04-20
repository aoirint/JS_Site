
function connectWithXHR(url, responseType, callback)
{
	if (url == undefined || decodeURIComponent(url).indexOf('./') != -1)
	{
		console.log("Found Wrong Argument: url=" + url);
		return;
	}
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.responseType = responseType;
	
	xhr.onreadystatechange = function()
	{
		if (xhr.readyState != 4) return ;

		var response;
		
		if ((200 <= xhr.status && xhr.status < 300) || xhr.status == 304)
		{
			response = (xhr.responseType == 'document') ? xhr.responseXML : xhr.response;
		} else if (xhr.status == 404)
		{
			response = "404 Not Found: " + url;
		} else
		{
			response = 'Unknown error has occured';
		}
		
		callback(response);
	};
	
	xhr.send(null);
}