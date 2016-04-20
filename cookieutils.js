

function addCookie(name, value)
{
	document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
}

function getCookies()
{
	var cookies = new Array();

	if (document.cookie != "")
	{
		var cookieAry = document.cookie.split("; ");
		
		for (i=0; i<cookieAry.length; i++)
		{
			var splited = decodeURIComponent(cookieAry[i]).split("=");
			
			cookies[splited[0]] = splited[1];
		}
	}	
	
	return cookies;
}
