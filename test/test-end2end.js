/**
 * Created by igor on 04.02.17.
 */
const webdriver = require('selenium-webdriver');

require('geckodriver');
require('chromedriver');

const By = webdriver.By;
const until = webdriver.until;
const utilArr = require('utils-igor')('arr');
const driver = new webdriver.Builder()
	.forBrowser('chrome')
	.build();

let $buton;


let browserGetResult = call => {
	let isResultBad;
	let isResultGood;
	driver.get('http://localhost:63342/file-text-parser/test/browser/test.html')
		.then(() => {
			$buton = driver.findElement(By.id('fileLoad1'));
			$buton.sendKeys(`${__dirname}/browser/file-test-bad`);

			return driver.executeScript(() => fileParse.isOk(1));
		})
		.then(isBad => isResultBad = isBad)
		.then(() => {
			$buton.sendKeys(`${__dirname}/browser/file-test.txt`);

			return driver.executeScript(() => {
				if (!fileParse.isOk(1))
					return false;

				return fileParse.dataGet(1);
			});

		})
		.then(data => isResultGood = utilArr.diff(data[0], ['1', '1_2', '1_3']).length || utilArr.diff(data[1], ['2', '2_2', '2_3']).length)
		.then(()=> {
			driver.quit();
			call(isResultBad, isResultGood);
			//driver.wait(until.titleIs('webdriver - Google Search'), 6000);
		});
};

describe('End-to-end', done => {
	let isResultBad;
	let isResultGood;

	before(done => {
		browserGetResult((isBad, isGood) => {
			isResultBad  = isBad;
			isResultGood = isGood;
			done();
		});
	});

	it('with bad file', done => {
		if (isResultBad)
			throw new Error('Test failing');
		done();
	});

	it('with good file', done => {
		if (isResultGood)
			throw new Error('Test failing');
		done();
	});
});
