function init(currentPageId)
{
	initPage(currentPageId);
	initCategories(currentPageId);
}

function initPage()
{
	var main = document.getElementById("main");
	
	connectWithXHR("pages/" + currentPageId + ".html", "document", function(response)
	{
		var html = response;
		var metaTags = html.head.getElementsByTagName('meta');
		var metas = {};
		
		for (var i=0; i<metaTags.length; ++i)
		{
			metas[metaTags[i].name] = metaTags[i].content;
		}
		
		if ('title' in metas) document.title = metas['title'] + " | " + document.title;
		
		main.innerHTML = html.body.innerHTML;
	});
}

function initCategories()
{
	var categories = document.getElementById("categories");
	
	connectWithXHR("pages/categories.html", "text", function(response)
	{
		categories.innerHTML = response;
		
		document.getElementById("listCategories").addEventListener("click", function(event)
		{
			if (event.target.tagName == 'li')
			{
				var tree = event.target.children;
			
				for (var i=0; i<tree.length; ++i)
				{
					tree[i].style.display = tree[i].style.display != 'none' ? 'none' : 'block';
				}
			}
			
		}, true);
	});
	
}
