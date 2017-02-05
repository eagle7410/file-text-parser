# file-text-parser
Class for parse text file in browser. This is plugin used ecma6.
For community used es6-sham.js and him used jquery. By default him used components-font-awesome.

```bash
npm install file-text-parser --save
or
bower file-text-parser --save
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
		window.fileParse = new FileParse();
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
Also, for debugging, you can use class FileParseDebug
```js
<script type="text/javascript">
		window.fileParse = new FileParse();
    	fileParse.init();
	</script>
```
**Result:**
![screenshot](https://raw.githubusercontent.com/eagle7410/file-text-parser/master/debug.jpg)
Also, have small version in file ig.file.parser.small.js. Him no have debug component.
### Api
## Classes

<dl>
<dt><a href="#FileParse">FileParse</a></dt>
<dd><p>Class for parse text file</p>
</dd>
<dt><a href="#FileParseDebug">FileParseDebug</a></dt>
<dd><p>Class for debug FileParse</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#option">option</a> : <code>Object</code></dt>
<dd><p>This is option for custom.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#is">is(v, type)</a></dt>
<dd><p>Check v be is type.</p>
</dd>
<dt><a href="#isObj">isObj(o)</a></dt>
<dd><p>Check o be is object</p>
</dd>
<dt><a href="#isEmptyObj">isEmptyObj(o)</a> ⇒ <code>boolean</code></dt>
<dd><p>Check object have properties</p>
</dd>
<dt><a href="#isFn">isFn(fn)</a></dt>
<dd><p>Check fn be function</p>
</dd>
<dt><a href="#div">div(cls, name)</a></dt>
<dd><p>Return div with instruction class, and id = class + name</p>
</dd>
<dt><a href="#noop">noop()</a></dt>
<dd><p>Empty function</p>
</dd>
<dt><a href="#checkCall">checkCall(cb)</a></dt>
<dd><p>Check cb be function. If not return empty function.</p>
</dd>
<dt><a href="#isUTF">isUTF(s)</a></dt>
<dd><p>Check s have problem with read text as UTF-8.</p>
</dd>
<dt><a href="#ext">ext(obj, op)</a> ⇒ <code>*</code></dt>
<dd><p>Extended object</p>
</dd>
</dl>

<a name="FileParse"></a>

## FileParse
Class for parse text file

**Kind**: global class

* [FileParse](#FileParse)
    * [.systemErr(num)](#FileParse+systemErr) ⇒ <code>Array</code>
    * [.dataClearAll()](#FileParse+dataClearAll)
    * [.dataClear(num)](#FileParse+dataClear)
    * [.dataGet(num)](#FileParse+dataGet) ⇒ <code>\*</code>
    * [.isUsed(num)](#FileParse+isUsed) ⇒ <code>boolean</code>
    * [.isOk(num)](#FileParse+isOk) ⇒ <code>boolean</code>
    * [.optionSet(options)](#FileParse+optionSet) ⇒ <code>\*</code> &#124; <code>number</code>
    * [.phrase(mark)](#FileParse+phrase) ⇒ <code>\*</code> &#124; <code>string</code>
    * [.init(options)](#FileParse+init)

<a name="FileParse+systemErr"></a>

### fileParse.systemErr(num) ⇒ <code>Array</code>
Return system errors

**Kind**: instance method of <code>[FileParse](#FileParse)</code>

| Param | Type |
| --- | --- |
| num | <code>\*</code> |

<a name="FileParse+dataClearAll"></a>

### fileParse.dataClearAll()
Clear all data

**Kind**: instance method of <code>[FileParse](#FileParse)</code>
<a name="FileParse+dataClear"></a>

### fileParse.dataClear(num)
Clear data for instruction number instance.

**Kind**: instance method of <code>[FileParse](#FileParse)</code>

| Param | Type |
| --- | --- |
| num | <code>\*</code> |

<a name="FileParse+dataGet"></a>

### fileParse.dataGet(num) ⇒ <code>\*</code>
Get result for instruction number instance.

**Kind**: instance method of <code>[FileParse](#FileParse)</code>

| Param | Type |
| --- | --- |
| num | <code>\*</code> |

<a name="FileParse+isUsed"></a>

### fileParse.isUsed(num) ⇒ <code>boolean</code>
Check instance with instruction number be load file.

**Kind**: instance method of <code>[FileParse](#FileParse)</code>

| Param | Type |
| --- | --- |
| num | <code>\*</code> |

<a name="FileParse+isOk"></a>

### fileParse.isOk(num) ⇒ <code>boolean</code>
Is check load parse be normal

**Kind**: instance method of <code>[FileParse](#FileParse)</code>

| Param | Type |
| --- | --- |
| num | <code>\*</code> |

<a name="FileParse+optionSet"></a>

### fileParse.optionSet(options) ⇒ <code>\*</code> &#124; <code>number</code>
Set options to class.

**Kind**: instance method of <code>[FileParse](#FileParse)</code>

| Param |
| --- |
| options |

<a name="FileParse+phrase"></a>

### fileParse.phrase(mark) ⇒ <code>\*</code> &#124; <code>string</code>
Get phrase by key

**Kind**: instance method of <code>[FileParse](#FileParse)</code>

| Param |
| --- |
| mark |

<a name="FileParse+init"></a>

### fileParse.init(options)
Init file parse elements

**Kind**: instance method of <code>[FileParse](#FileParse)</code>

| Param | Type |
| --- | --- |
| options | <code>object</code> |

<a name="FileParseDebug"></a>

## FileParseDebug
Class for debug FileParse

**Kind**: global class
<a name="FileParseDebug+_log"></a>

### fileParseDebug._log(mess, data, type)
Function for console log messages.

**Kind**: instance method of <code>[FileParseDebug](#FileParseDebug)</code>

| Param | Type | Default |
| --- | --- | --- |
| mess | <code>\*</code> |  |
| data | <code>\*</code> |  |
| type | <code>\*</code> | <code>i</code> |

<a name="option"></a>

## option : <code>Object</code>
This is option for custom.

**Kind**: global variable
<a name="is"></a>

## is(v, type)
Check v be is type.

**Kind**: global function

| Param | Type |
| --- | --- |
| v | <code>\*</code> |
| type | <code>string</code> |

<a name="isObj"></a>

## isObj(o)
Check o be is object

**Kind**: global function

| Param | Type |
| --- | --- |
| o | <code>\*</code> |

<a name="isEmptyObj"></a>

## isEmptyObj(o) ⇒ <code>boolean</code>
Check object have properties

**Kind**: global function

| Param | Type |
| --- | --- |
| o | <code>\*</code> |

<a name="isFn"></a>

## isFn(fn)
Check fn be function

**Kind**: global function

| Param | Type |
| --- | --- |
| fn | <code>\*</code> |

<a name="div"></a>

## div(cls, name)
Return div with instruction class, and id = class + name

**Kind**: global function

| Param | Type |
| --- | --- |
| cls | <code>string</code> |
| name | <code>string</code> &#124; <code>number</code> |

<a name="noop"></a>

## noop()
Empty function

**Kind**: global function
<a name="checkCall"></a>

## checkCall(cb)
Check cb be function. If not return empty function.

**Kind**: global function

| Param | Type |
| --- | --- |
| cb | <code>\*</code> |

<a name="isUTF"></a>

## isUTF(s)
Check s have problem with read text as UTF-8.

**Kind**: global function

| Param | Type |
| --- | --- |
| s | <code>string</code> |

<a name="ext"></a>

## ext(obj, op) ⇒ <code>\*</code>
Extended object

**Kind**: global function

| Param | Type |
| --- | --- |
| obj | <code>object</code> |
| op |  |


### Version
----
1.0.0

### People
----
Author and developer is [Igor Stcherbina](https://github.com/eagle7410)

### License
----
MIT

**Free Software**
