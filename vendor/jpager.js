
// 黒魔術 グローバル変数 id 参照あり


function pullStatus(path, callback)
{
	var xhr = new XMLHttpRequest();
	xhr.open('HEAD', path);
	
	xhr.onreadystatechange = function()
	{
		if (xhr.readyState != 4) return ;
		
		callback(xhr.status);
	};
	
	xhr.send();
}

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

function loadFileData(elm, data, callback)
{
	function loadAll(tags, funcPath, cb)
	{
		for (var i=0; i<tags.length; ++i)
		{
			var tag = tags[i];
			var j = i;
			// var path = tag.textContent != '' ? tag.textContent : tag.dataset.src != '' ? tag.dataset.src : '';
			var path = funcPath(tag);
			path = path.trim();
			
			if (path == '') continue;
			
			pullFile(path, function(res)
			{
				tag.innerHTML = res;
				tag.dataset.src = path;
				parseElement(tag, data);
				
				if (j == tags.length -1 && cb != undefined) cb();
			});
		}
		
		if (tags.length == 0 && cb != undefined) cb();
	}
	
	var obj =
	{
		main: false,
		hash: false
	};
	
	var notify = function()
	{
		var bool = true;
		for (var key in obj) bool = bool && obj[key];
		
		if (bool) callback();
	}

	loadAll(elm.querySelectorAll('[data-load]'), function(tag)
		{
			return tag.textContent != '' ? tag.textContent : '';
		}, 
		function() { obj['main'] = true; notify(); }
	);

	loadAll(elm.querySelectorAll('[data-load-hash]'), function(tag)
		{
			if (location.hash == '')
			{
				if ('defaultHash' in data['metas'])
				{
					location.hash = '#' + data['metas']['defaultHash'];
				}
				
				if (location.hash == '') return '';
			}
			
			return getHashPath(location.hash.substr(1));
		}, 
		function() { obj['hash'] = true; notify(); }
	);
}

function getHashPath(hash)
{
	var suffix = hash.charAt(0) == 'h' ? '.html' : '.txt';
	
	return 'data/' + id + '/' + hash.substr(1) + suffix;
}

function parseMarkupLang(elm, data, callback)
{
	if (elm.dataset.markupLang == undefined) return ;
	var langs = elm.dataset.markupLang.split(/\s+/);
	var html = elm.innerHTML;
	
	var flagMarkdown = 0 <= langs.indexOf('markdown');
	var flagRuby = 0 <= langs.indexOf('ruby');
	var flagNovel = 0 <= langs.indexOf('novel');
	
	var obj =
	{
		markdown: !flagMarkdown,
		ruby: !flagRuby,
		novel: !flagNovel
	};
	
	var notify = function()
	{
		var bool = true;
		for (var key in obj) bool = bool && obj[key];
		
		if (bool) callback(html);
	};
	
	if (flagMarkdown)
	{
		html = marked(html);
	}
	obj['markdown'] = true;

	if (flagRuby)
	{
		html = rubied(html);
	}
	obj['ruby'] = true;
	
	if (flagNovel)
	{
		noveled(html, function(result)
		{
			html = result;
			obj['novel'] = true;
			notify();
		});
	}
	
	notify();
}

function parseElement(elm, data)
{
	loadFileData(elm, data,
		function() { parseChildrenMarkupLang(elm, data); }
	);
}

function parseChildrenMarkupLang(elm, data)
{
	var targetTags = elm.querySelectorAll('[data-markup-lang]');
	
	for (var i=0; i<targetTags.length; ++i)
	{
		var tag = targetTags[i];
		parseMarkupLang(tag, data, function(html)
		{
			tag.innerHTML = html;
		});
	}

}

function parsePage(doc, callback)
{
	var data = {};
	
	data['metas'] = parseMeta(doc);
	data['body'] = doc.body;
	
	var elm = callback(data);
	parseElement(elm, data);
}



function rubied(text)
{
	function convert(match, p1, p2, offset, string)
	{
		return '<ruby>' + p1 + '<rt>' + p2 + '</rt></ruby>';
	}
	
	return text.replace(/\|(.*?)≪(.*?)≫/g, convert);
}

function noveled(text, callback)
{
	function wrapTitle(p)
	{
		return '<h3 class="novel-title">' + p.trim() + '</h3>';
	}
	function wrapIntro(p)
	{
		return '<div class="novel-intro">' + p.trim() + '</div>';
	}
	function wrapBody(p)
	{
		return '<div class="novel-body">' + p.trim() + '</div>';
	}
	function wrapAfter(p)
	{
		return '<div class="novel-after">' + p.trim() + '</div>';
	}
	
	var regTIBA = /([\s\S]*?)=====([\s\S]*?)-----([\s\S]+)-----([\s\S]*)/;
	var regTIB = /([\s\S]*?)=====([\s\S]*?)-----([\s\S]+)/;
	// var regTBA = /([\s\S]*?)=====([\s\S]+)-----([\s\S]*)/;
	var regTB = /([\s\S]*?)=====([\s\S]+)/;
	var regB = /([\s\S]+)/;
	
	if (text.match(regTIBA))
	{
		text = text.replace(regTIBA, function(match, p1, p2, p3, p4, offset, string)
		{
			return wrapTitle(p1) + wrapIntro(p2) + wrapBody(p3) + wrapAfter(p4);
		});
	} else if (text.match(regTIB))
	{
		text = text.replace(regTIB, function(match, p1, p2, p3, offset, string)
		{
			return wrapTitle(p1) + wrapIntro(p2) + wrapBody(p3);
		});
/*	} else if (text.match(regTBA))
	{
		text = text.replace(regTBA, function(match, p1, p2, p3, offset, string)
		{
			return wrapTitle(p1) + wrapBody(p2) + wrapAfter(p3);
		});
*/		
	} else if (text.match(regTB))
	{
		text = text.replace(regTB, function(match, p1, p2, offset, string)
		{
			return wrapTitle(p1) + wrapBody(p2);
		});
		
	} else if (text.match(regB))
	{
		text = text.replace(regB, function(match, p1, offset, string)
		{
			return wrapBody(p1);
		});
		
	}
	
	
	if (location.hash != '')
	{
		var type = location.hash.charAt(1);
		var id = location.hash.substr(2);
		
		if (id.match(/\d+/))
		{
			var intId = parseInt(id);
			
			function formatInt3(i)
			{
				if (i < 10) return '00' + i;
				else if (i < 100) return '0' + i;
				
				return i;
			}
			
			var obj =
			{
				prev: undefined,
				next: undefined
			};
			
			var ctrl = document.createElement('div');
			ctrl.className = 'novel-ctrl';
			
			var notify = function()
			{
				var bool = true;
				for (var key in obj)
				{
					bool = bool && obj[key] != undefined;
				}
				
				if (bool)
				{
					ctrl.innerHTML = obj['prev'] + obj['next'];
					text = ctrl.outerHTML + '<section class="novel">' + text + '</section>' + ctrl.outerHTML;
					callback(text);
				}
			};
			
			if (0 <= intId-1)
			{
				var hashprv = type + formatInt3(intId-1);
				
				pullStatus(getHashPath(hashprv), function(status)
				{
					if (status != 404)
					{
						obj['prev'] = '<a href="#' + hashprv + '" class="novel-ctrl-prev" onclick="location.reload()">前へ</a>';
					} else obj['prev'] = '';
					
					notify();
				});
			} else obj['prev'] = '';

			var hashnxt = type + formatInt3(intId+1);
			pullStatus(getHashPath(hashnxt), function(status)
			{
				if (status != 404)
				{
					obj['next'] = '<a href="#' + hashnxt + '" class="novel-ctrl-next" onclick="location.reload()">次へ</a>';
				} else obj['next'] = '';

				notify();
			});
			
		} else callback(text);
	} else callback(text);

}

