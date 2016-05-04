
function pullPage(path, callback)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', path + '.html');
	xhr.responseType = 'document';
	
	xhr.onreadystatechange = function()
	{
		if (xhr.readyState != 4) return ;
		
		callback(parsePage(xhr.responseXML));
	};
	
	xhr.send();
}

function parseMeta(doc)
{
	var metas = {};
	var metaTags = doc.head.getElementsByTagName('meta');
	
	for (var i=0; i<metaTags.length; ++i)
	{
		if (metaTags[i].name == '') continue;
		
		metas[metaTags[i].name] = metaTags[i].content;
	}

	return metas;
}

function parsePage(doc)
{
	var data = {};
	data['metas'] = parseMeta(doc);
	data['body'] = doc.body;
	

	return data;
}