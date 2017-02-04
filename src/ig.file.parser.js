/**
 * Created by igor on 04.02.17.
 */
'use strict';

/**
 * Check v be is type.
 * @param {*} v
 * @param {string} type
 */
let is = (v, type) => typeof v === type;

/**
 * Check o be is object
 * @param {*} o
 */
let isObj = (o) => is(o, 'object');

/**
 * Check object have properties
 * @param {*} o
 * @returns {boolean}
 */
let isEmptyObj = (o) => {

	if (!o || !isObj(o))
		return true;

	return Object.keys(o).length ? false : true;
};

/**
 * Check fn be function
 * @param {*} fn
 */
let isFn = (fn) => is(fn, 'function');
//noinspection ReservedWordAsName
/**
 * Return div with instruction class, and id = class + name
 * @param {string} cls
 * @param {string|number} name
 */
let div = (cls, name) => $('<div>', {class: cls, id: cls + name});

/**
 * Empty function
 */
let noop = () => {
};

/**
 * Check cb be function. If not return empty function.
 * @param {*} cb
 */
let checkCall = (cb) => isFn(cb) ? cb : noop;

/**
 * Check s have problem with read text as UTF-8.
 * @param {string} s
 */
let isUTF = (s) => !(/(\ufffd)+/g.test(s));

/**
 * Extended object
 * @param {object} obj
 * @param op
 * @returns {*}
 */
let ext = (obj, op) => {
	let j;
	j = (obj, op) => {
		Object.keys(op).map(k => {
			if (isObj(op[k])) {
				if (!obj[k])
					obj[k] = op[k];
				else
					j(obj[k], op[k]);

			} else
				obj[k] = op[k];
		});
	};

	if (!isEmptyObj(op)) j(obj, op);

	return obj;
};

/**
 * This is option for custom.
 * @type {{classMain: string, classLoad: string, classAddInLoad: string, tagIconLoad: string, tagIconDelete: string, classIconDelete: string, fieldDelimiter: string, label: null, fileAccept: string, fileExt: string[], checkTypes: string[], afterLoad: Function, phrases: {labelWord: string, noLoading: string, charsetBad: string, typeBad: string, fileNoExt: string, fileEmpty: string}}}
 */
let option = {
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
	afterLoad      : noop,
	phrases        : {
		labelWord : 'Selected file',
		noLoading : 'Not load',
		charsetBad: 'File no utf-8 charset',
		typeBad   : 'Invalid type file',
		fileNoExt : 'File don\'t have extended',
		fileEmpty : 'File empty'
	}
};

class FileParse {
	constructor() {
		ext(this, {
			errs: {},
			data: {},
			info: {},
			option: option
		});
	}

	/**
	 * Function for console log messages.
	 * @private
	 */
	_log() {
	}

	/**
	 * Run / Stop load animation.
	 * @param {object}  $el
	 * @param {boolean} end
	 * @private
	 */
	_loading($el, end = false) {
		let add = this.option.classAddInLoad;
		end ? $el.removeClass(add).hide() : $el.addClass(add).show();
	}

	/**
	 * Parse string and spilt to line, fields.
	 * @param {*}      num
	 * @param {string} data
	 * @param {*}      cb
	 * @private
	 */
	_parse(num, data, cb) {

		let that    = this;
		let objData = that.data[num] = [];
		let log     = (mess, data) => that._log({num: num, mess: mess}, data);

		log('Start parse and split');

		//noinspection JSValidateTypes
		data = data.replace(/\r/g, '').replace(/(\n{2,})/g, "\n").split("\n");
		//noinspection JSUnresolvedFunction
		data.map(line => (line && line.length) ? objData.push(line.split(that.option.fieldDelimiter)) : '' );

		log('Finish parse, split into field', objData);

		checkCall(cb)();
	}

	/**
	 * Action for change file.
	 * @param {*} ev
	 * @private
	 */
	_load(ev) {
		let that   = this;
		let target = ev.target;
		let $el    = $(target);
		let reader = new FileReader();
		let num    = $el.data('number');
		let $ic    = $('#anime' + num);
		let option = that.option;
		let err    = (mess, data) => {
			that._err(num, mess, data);
			that._loading($ic, true);
		};

		if (!$el.val())
			return;

		that.errs[num] = [];
		that._loading($ic);

		that._log('Start loading & reading ...');

		let file = target.files[0];
		let info = that.info;

		reader.onload = () => {

			if (reader.error)
				return err('noLoading', reader.error);

			setTimeout(() => {

				//noinspection JSCheckFunctionSignatures
				if (!isUTF(reader.result))
					return err('charsetBad');

				//noinspection JSCheckFunctionSignatures
				that._parse(num, reader.result, () => {
					that._loading($ic, true);
					that._log('End loading & reading', that);
					checkCall(option.afterLoad)(ev);
				});

			}, 0);
		};

		info[num] = {};
		info = info[num];
		['name', 'type', 'size'].map(prop => file[prop] ? info[prop] = file[prop] : '');

		let $blockFileName = $('#fileMove' + num);

		if ($blockFileName.length)
			$blockFileName.remove();

		$blockFileName = div('fileMove', num);

		//noinspection ReservedWordAsName
		let $delFile = $(option.tagIconDelete, { class: option.classIconDelete }).click(ev => {
			$(ev.target).parent().remove();
			that.dataClear(num);
		});

		$blockFileName.html(info.name).prepend($delFile);
		$el.after($blockFileName);

		if (!info.name)
			return err('typeBad');

		if (!info.type) {
			let reg = new RegExp('[^\s]+\.(' + option.fileExt.join('|').replace(/\./g, '') + ')$', 'gm');

			if (!reg.test(info.name))
				return err('fileNoExt');
		}

		let checkTypes = option.checkTypes;

		if (checkTypes && checkTypes.indexOf(info.type) === -1)
			return err('typeBad');

		if (!info.size)
			return err('fileEmpty');

		reader.readAsText(file);
		$el.val('');
	}

	/**
	 * Return system errors
	 * @param {*} num
	 * @returns {Array}
	 */
	systemErr(num) {
		let r = [];
		let that = this;

		if (that.errs[num])
			that.errs[num].map(err => (err.mess && err.mess.type === 'system') ? r.push(err) : false);

		return r;
	}

	//noinspection JSUnusedGlobalSymbols
	/**
	 * Clear all data
	 */
	dataClearAll() {
		let that = this;
		that.info[num] = {};
		that.data[num] = {};
		that.errs[num] = {};
	}

	/**
	 * Clear data for instruction number instance.
	 * @param {*} num
	 */
	dataClear(num) {
		let that = this;
		that.info[num] = {};
		that.data[num] = [];
		that.errs[num] = [];
	}

	//noinspection JSUnusedGlobalSymbols
	/**
	 * Check instance with instruction number be load file.
	 * @param {*} num
	 * @returns {boolean}
	 */
	isUsed(num) {
		return !isEmptyObj(this.info[num]);
	}

	//noinspection JSUnusedGlobalSymbols
	/**
	 * Is check load parse be normal
	 * @param {*} num
	 * @returns {boolean}
	 */
	isOk(num) {
		return !this.systemErr(num).length;
	}

	//noinspection JSUnusedGlobalSymbols
	/**
	 * Set options to class.
	 * @param options
	 * @returns {*|number}
	 */
	optionSet(options) {
		let that = this;

		if (!isObj(options))
			return that._log('Options not object');

		ext(that.option, options);
	}

	/**
	 * Create error.
	 * @param {*} num
	 * @param {*} mess
	 * @param {*} data
	 * @returns {*}
	 * @private
	 */
	_err(num, mess, data) {
		if (!mess && !data)
			return;

		if (!isObj(mess))
			mess = {
				type: 'system',
				text: mess
			};

		let that = this;

		mess.text = that.phrase(mess.text);

		that.errs[num].push({
			mess: mess,
			data: data || null
		});

		return mess;
	}

	/**
	 * Get phrase by key
	 * @param mark
	 * @returns {*|string}
	 */
	phrase(mark) {
		return this.option.phrases[mark] || '';
	}

	/**
	 * Init file parse elements
	 * @param {object} options
	 */
	init(options = {}) {
		let that = this;
		let option = that.option;

		ext(option, options);

		if (!options.label)
			option.label = `<a href="#"> ${that.phrase('labelWord')} (${option.fileExt.join(' ,')})</a>`;

		that._log('Start init');

		let count = 0;
		let classSearch = option.classMain;

		$(`.${classSearch}`).each((index, element) => {

			let $fileLoader;
			++count;
			let $el = $(element);
			let mark = $el.data('id') || count;
			//noinspection ReservedWordAsName
			let $icon = $(option.tagIconLoad, {
				class: option.classLoad,
				id: 'anime' + count
			}).hide();
			let $blockLabel = div('load-label', count);
			let $blockExec  = div('load-exec', count);
			//noinspection ReservedWordAsName
			$fileLoader = $('<input>', {
				id: 'fileLoad' + mark,
				type: 'file',
				class: `file_${classSearch}`,
				accept: option.fileAccept
			});

			$el.html($blockLabel).append($blockExec);

			$blockLabel.html(option.label).append($icon);

			$fileLoader.data('number', mark)
				.change(ev => that._load(ev))
				.css({
					opacity : 0,
					width   : $blockLabel.css('width'),
					height  : $blockLabel.css('height')
				});

			$blockExec.html($fileLoader).offset($blockLabel.offset());

		});

		that._log(!count ? 'Not found elements' : `Found ${count} elements`);

	}
}

/* exported FileParseDebug */

/**
 *  Class for debug FileParse
 */
class FileParseDebug extends FileParse {
	constructor () { super(); }
	/**
	 * Function for console log messages.
	 * @param {*} mess
	 * @param {*} data
	 * @param {*} type
	 */
	_log(mess, data, type = 'i') {
		let num;

		if (isObj(mess)) {
			num = mess.num;
			mess = mess.mess;
		}

		type = type === 'i' ? 'Info' : 'Error';
		num = num ? `/Is #${num} ` : '';

		console.log(`parseFile/${type + num}. ${mess}`, data || '');
	}

	/**
	 * Create error.
	 * @param {*} num
	 * @param {*} mess
	 * @param {*} data
	 * @private
	 */
	_err(num, mess, data) {
		let that = this;
		mess = super._err(num, mess, data);
		that._log(`Is #${num}/${mess.type}/${mess.text}`, data, 1);
		that._log('Instance ', that);
	}
}
