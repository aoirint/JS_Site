# JS_Site
Simple Website Using JavaScript (Ajax?)

http://kanomiya.github.io/JS_Site

## Article HTML File

### Meta
|name|content|
|:--|:--|
|title|The title of the article|

## Language Parser
#### Supporting
- Markdown, thanks to [marked](https://github.com/chjj/marked)
- Ruby, forms |TEXT≪RUBY≫
- Novel, 
    - Heading =====  
Introduction -----  
Body  
----- Afterwords

## File Loader
e.g. prints a textfile...

Please append an attribute 'data-load', and set the tag content into a path of your textfile.

&lt;TAG data-load&gt;PATH&lt;/TAG&gt;

### From Hash
&lt;TAG data-load-hash&gt;&lt;/TAG&gt;

Hash: #mPATH

#### Supporting Type
|m (Hash First Letter)|Type|
|:--|:--|
|h|HTML(document)|
|OTHERS|テキスト|
