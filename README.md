# file-text-parser
Class for parse text file in browser. This is plugin used ecma6.
For community used es6-sham.js and him used jquery. By default him used components-font-awesome.

```bash
npm install file-text-parser
```
### Example used
package.json

```js
	<head>
	<link href='../../bower_components/components-font-awesome/css/font-awesome.min.css' rel='stylesheet'
			type='text/css'/>
	<script type="text/javascript" src="../../bower_components/es6-shim/es6-sham.js"></script>
	<script type="text/javascript" src="../../bower_components/jquery/dist/jquery.js"></script>
	<script src="../../src/ig.file.parser.js"></script>
	<script type="text/javascript">
		window.fileParse = new FileParseDebug();
		fileParse.optionSet({
				classMain      : 'fileParse',
				classLoad      : 'fa fa-spinner',
				classAddInLoad : 'fa-pulse',
				tagIconLoad    : '<i>',
				tagIconDelete  : '<i>',
				classIconDelete: 'fa fa-trash',
				fieldDelimiter : ';',
				label          : null,
				fileAccept     : '.csv, text/plain',
				fileExt        : ['.csv', '.txt'],
				checkTypes     : ['text/plain', 'text/csv', 'application/csv', 'application/vnd.ms-excel'],
				afterLoad      : ev => {
					let $el = $(ev.target);
					let num = $el.data('number');
					console.log('data' , fileParse.dataGet(num));
				},
				phrases        : {
					labelWord : 'Selected file',
					noLoading : 'Not load',
					charsetBad: 'File no utf-8 charset',
					typeBad   : 'Invalid type file',
					fileNoExt : 'File don\'t have extended',
					fileEmpty : 'File empty'
				}
		});
		fileParse.init();
	</script>
	<style>
		i.fa-trash:hover {
			color: red;
		}
	</style>
	</head>
	<body>
		<div class="fileParse"></div>
	</body>
	</html>
```
**Result:**
![screenshot](https://raw.githubusercontent.com/eagle7410/file-text-parser/master/result.jpg)
### Version
----
2.0.0
What is new ?
	- Used "use strict" mode.
	- Used minification js files.
	- Attach unit test
	- Maximum use ESMA6 within Node 4.x.x
	- Change :
	    Remove function obj.clone him be in type.cloneVar
	    Remove function date.showTime add parameter format in date.date
	    Add new function arr.check
	    And etc...
2.0.2
 Adding time constant in date module
2.0.3
 Correct function arr.mvVal

### People
----
Author and developer is [Igor Stcherbina](https://github.com/eagle7410)

### License
----
MIT

**Free Software**
