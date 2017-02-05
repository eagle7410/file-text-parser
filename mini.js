/**
 * Created by igor on 05.02.17.
 */

const minify = require('minify-js');

minify.file({
	file : './src/ig.file.parser.js',
	dist : './src/ig.file.parser.min.js'
}, (e, compress) => {

	if (e) {
		console.log('ERROR ', e);
		return done();
	}

	compress.run((e) => {
		e ? console.log('Process fail', e) : console.log('Process sucess');
		minify.file({
			file : './src/ig.file.parser.small.js',
			dist : './src/ig.file.parser.small.min.js'
		}, (e, compress) => {
			if (e) {
				console.log('ERROR ', e);
				return done();
			}

			compress.run((e) => e ? console.log('Process fail', e) : console.log('Process sucess for small'));
		});
	});
});
