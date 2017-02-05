/**
 * Created by igor on 04.02.17.
 */
'use strict';

$(() => {
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
});
