/**
 * Created by igor on 04.02.17.
 */

/**
 * Created by igor on 13.04.16.
 */

/* exported fileParse */

function fileParse() {
	ext(this, {
		errs     : {},
		data     : {},
		info     : {},
		optionSet: optionSet,
		option   : {
			debug          : false,
			classMain      : 'fileParse',
			fieldDelimiter : ';',
			label          : null,
			fileAccept     : '.csv, text/plain',
			fileExt        : ['.csv', '.txt'],
			checkTypes     : ['text/plain', 'text/csv' , 'application/csv', 'application/vnd.ms-excel'],
			afterLoad      : noop,
			phrases        : {
				labelWord  : 'Загрузить',
				noLoading : 'not Load',
				charsetBad : 'File no utf-8 charset',
				typeBad    : 'Invalid type file',
				fileEmpty  : 'File empty',
				splitErr   : 'Part #$part$ invalid line (#$line$)'
			}
		},
		err       : err,
		log       : log,
		parse     : parse,
		isUsed    : isUsed,
		isOk      : isOk,
		load      : load,
		init      : init,
		systemErr : systemErr,
		dataGet   : dataGet,
		dataClear : dataClear,
		phrase    : phrase
	});

}

function optionSet(op) {
	if (!isObj(op)) {
		return this.log('Options not object');
	}

	ext(this.option, op);
}

function phrase(mark) {

	var r;

	if (isObj(mark)) {

		var dt = mark.data;
		mark = mark.text;
		r = this.option.phrases[mark];

		if (isObj(dt) && !dt) {
			Object.keys(dt).forEach(function (val, key) {
				r = r.replace('$' + key + '$', val);
			});
		}

	} else {
		r = this.option.phrases[mark];
	}

	return r || '';
}

function defLabel(word) {
	return '<a href="#">' + word + ' (' + this.option.fileExt.join(' ,') + ')</a>';
}

function dataClear(num) {
	this.info[num] = {};
	this.data[num] = [];
	this.errs[num] = [];
}

function dataGet(num) {
	var r = null;

	if (Array.isArray(this.data[num])) {
		r = [];
		this.data[num].forEach(function (el) {
			r.push(el);
		});
	} else if (isObj(this.data[num])) {
		r = ext({}, this.data[num]);
	}

	return r;
}

function isOk(num) {
	return !this.systemErr(num).length;
}

function systemErr(num) {
	var r = [];

	if (this.errs[num]) {
		this.errs[num].map(function (err) {
			if (err.mess && err.mess.type === 'system') {
				r.push(err);
			}
		});
	}

	return r;
}

function isUsed(num) {
	return !isEmptyObj(this.info[num]);
}

function init(op) {

	if (!op) {
		op = {};
	}

	ext(this.option, op);

	if (!op.label) {
		this.option.label = defLabel.call(this, this.phrase('labelWord'));
	}

	this.log('Start init');

	var count = 0;
	var that  = this;

	$('.' + this.option.classMain).each(function () {

		++count;
		var $el   = $(this);
		var mark  = $el.data('id') || count;
		var $icon = $('<i>', {
			class : 'fa fa-spinner',
			id    : 'anime' + count
		}).hide();
		var $blockLabel = div('load-label', count);
		var $blockExec  = div('load-exec' , count);
		var $fileLoader = $('<input>', {
			type   : 'file',
			id     : 'fileLoad' + mark,
			class  : 'parseFile',
			accept : that.option.fileAccept
		});

		$el.html($blockLabel).append($blockExec);

		$blockLabel.html(that.option.label).append($icon);

		$fileLoader.data('number', mark).change(function (ev) {
			that.load(ev);
		}).css({
			opacity : 0,
			width   : $blockLabel.css('width'),
			height  : $blockLabel.css('height')
		});

		$blockExec.html($fileLoader).offset($blockLabel.offset());

	});

	this.log(!count ? 'Not found elements' : 'Found ' + count + ' elements');

}

function load (ev) {
	var target = ev.target;
	var $el    = $(target);
	var that   = this;
	var reader = new FileReader();
	var num    = $el.data('number');
	var $ic    = $('#anime' + num);
	var err    = function (mess, data) {
		that.err(num, mess, data);
		animeLoading($ic, true);
	};

	if (!$el.val()) {
		return;
	}

	that.errs[num] = [];
	animeLoading($ic);

	this.log('Start loading & reading ...');

	var file = target.files[0];
	var info = that.info;

	reader.onload = function () {

		if (reader.error) {
			return err('noLoading', reader.error);
		}

		setTimeout(function () {

			if (!isUTF(reader.result)) {
				return err('charsetBad');
			}

			that.parse(num, reader.result, function () {


				animeLoading($ic, true);

				that.log('End loading & reading', that);

				that.option.afterLoad = checkCb(that.option.afterLoad);
				that.option.afterLoad(ev);

			});
		});

	};

	info[num] = {};
	info      = info[num];

	['name', 'type', 'size'].forEach(function (prop) {
		if (file[prop]) {
			info[prop] = file[prop];
		}
	});

	var $blockFileName = $('#fileMove' + num);

	if ($blockFileName.length) {
		$blockFileName.remove();
	}

	$blockFileName = div('fileMove', num);

	var $delFile   = $('<i>', {
		class : 'fa fa-trash'
	}).click(function () {

		$(this).parent().remove();

		that.dataClear(num);

	});

	$blockFileName.html(info.name).append($delFile);

	$el.after($blockFileName);

	if (!info.name) {
		return err('typeBad');
	} else if (!info.type) {

		var reg = new RegExp('[^\s]+\.(' + this.option.fileExt.join('|').replace(/\./g, '') + ')$', 'gm');

		if ( !reg.test(info.name)) {
			return err('typeBad');
		}

	} else if (this.option.checkTypes && this.option.checkTypes.indexOf(info.type) === -1) {
		return err('typeBad');
	}

	if (!info.size) {
		return err('fileEmpty');
	}

	reader.readAsText(file);
	$el.val('');
}

function parse(num, data, cb) {

	var delimiter = this.option.fieldDelimiter;
	var specLine  = '[&#,+()$~%`\'"*?!<>{}\\[\\];]';
	var that      = this;
	var objData   = this.data[num] = {};
	var log       = function (mess, data) {
		that.log({num: num, mess : mess}, data);
	};

	cb = checkCb(cb);

	log('Start parse and split');

	delimiter = ['#'].indexOf(delimiter) > -1 ? '\\' + delimiter : delimiter;
	specLine  = specLine.replace(delimiter , '');

	data  = data.replace(/\r/g, '').replace(/(\n{2,})/g, "\n" ).split( "\n" ); // jscs: disable validateQuoteMarks

	data.map(function (line, inx) {

		if (line && line.length) {
			line = line.split(that.option.fieldDelimiter);
			var key = line[0] || '';
			var url = line[1] || '';

			key = key.replace(new RegExp(specLine,'g'), ' ').replace(/(\s)+/g, ' ').trim();
			url = url.trim();

			objData[key] = isUrlValid(url) ? url : '' ;
		}

		delete data[inx];
	});

	log('Finish parse, split into field', objData);

	cb();
}


function isUrlValid (url) {

	if (!url || !url.length) {
		return false;
	}

	var r = (/^((https?:\/\/)[a-z0-9]((\.){0,1}([a-z0-9\-]{0,61}[a-z0-9]){1,}){1,}(\.[a-z]{2,6})(\/.*){0,})$/i).test(url);

	if (!r) {
		return r;
	}

	return !/([^:])(\/{2,})/.test(url);
}


function err(num, mess, data) {

	if (!mess && !data) {
		return;
	}

	if (!isObj(mess)) {
		mess = {
			type : 'system',
			text : mess
		};
	}

	mess.text = this.phrase(mess.text);

	this.errs[num].push({
		mess : mess,
		data : data || null
	});

	this.log('Is #' + num + '.' + mess.text + ' type ' + mess.type, data, 'e');
	this.log('params ', this);
}

function log (mess, data, type) {

	if (this.option.debug) {

		if (!type) {
			type = 'i';
		}

		var num;

		if (isObj(mess)) {

			num  = mess.num;
			mess = mess.mess;

		}

		type = type === 'i' ? 'Info' : 'Error' ;

		console.log('[parseFile /' + type + (num ? '/Is #' + num + ' ' : '') + '] ' + mess, data || '');
	}
}

function animeLoading($el, end) {
	if (end) {
		return $el.removeClass('fa-pulse').hide();
	}

	$el.addClass('fa-pulse').show();
}

function ext(obj, op) {
	var j = function (obj, op) {
		Object.keys(op).forEach(function (k) {
			if (isObj(op[k])) {
				if (!obj[k]) {
					obj[k] = op[k];
				} else {
					j(obj[k], op[k]);
				}
			} else {
				obj[k] = op[k];
			}
		});
	};

	if (op) {
		j(obj, op);
	}

	return obj;
}

function isEmptyObj(o) {

	if (!o) {
		return true;
	}

	return Object.keys(o).length ? false : true;
}

function is(v, tp) {
	return typeof v === tp;
}

function isObj(o) {
	return is(o, 'object');
}

function isFn(fn) {
	return is(fn, 'function');
}

function div(cls, nm) {
	return $('<div>', {class : cls, id : cls + nm });
}

function noop() {}

function checkCb(cb) {
	return isFn(cb) ? cb : noop ;
}

function isUTF (s) {
	return /(\ufffd)+/g.test(s) ? false : true;
}

