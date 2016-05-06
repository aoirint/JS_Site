
function pullFile(path, callback)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', path);
	
	xhr.onreadystatechange = function()
	{
		if (xhr.readyState != 4) return ;
		
		callback(xhr.response);
	};
	
	xhr.send();
}

function pullPage(path, callback)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', path + '.html');
	xhr.responseType = 'document';
	
	xhr.onreadystatechange = function()
	{
		if (xhr.readyState != 4) return ;
		
		parsePage(xhr.responseXML, callback);
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

function loadFileData(elm)
{
	var targetTags = elm.querySelectorAll('[data-load]');
	
	for (var i=0; i<targetTags.length; ++i)
	{
		var tag = targetTags[i];
		// var path = tag.textContent != '' ? tag.textContent : tag.dataset.src != '' ? tag.dataset.src : '';
		var path = tag.textContent != '' ? tag.textContent : '';
		path = path.trim();
		
		if (path == '') continue;
		
		pullFile(path, function(res)
		{
			tag.innerHTML = res;
			tag.dataset.src = path;
			parseMarkupLang(tag);
		});
	}

}

function parseMarkupLang(elm)
{
	var lang = elm.dataset.markupLang;
	
	if (lang == 'markdown') elm.innerHTML = marked(elm.innerHTML);
}

function parseChildrenMarkupLang(elm)
{
	var targetTags = elm.querySelectorAll('[data-markup-lang]');
	
	for (var i=0; i<targetTags.length; ++i)
	{
		parseMarkupLang(targetTags[i]);
	}

}

function parsePage(doc, callback)
{
	var data = {};
	
	data['metas'] = parseMeta(doc);

	parseChildrenMarkupLang(doc.body);
	data['body'] = doc.body;

	var elm = callback(data);
	
	loadFileData(elm);
	
}