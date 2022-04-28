const express = require('express');
const app = express();
//const Puppeteer = require('puppeteer');
const Puppeteer = require('../../affanBot/node_modules/puppeteer');
const browser = Puppeteer.launch(
{args: ['--no-sandbox'] }
//{headless: false}
);


function getSafe(fn, defaultVal) {
  try {
    return fn();
  } catch (e) {
    return defaultVal;
  }
}

async function doTask(brows,urlWebsite) {
    const brow= await brows;
    const page = await brow.newPage();
    try {
        //const urlWebsite= await urlWebsite;
        await page.setDefaultTimeout(58000);
        const blockedResources = [
		  'quantserve',
		  'effectivemeasure',
		  'moatads',
		  'perfectmarket',
		  'amazon-adsystem',
		  'sportslocalmedia',
		  'adzerk',
		  'doubleclick',
		  'adition',
		  'exelator',
		  'sharethrough',
		  'simgad',
		  'google-analytics',
		  'fontawesome',
		  'analytics',
		  'optimizely',
		  'clicktale',
		  'mixpanel',
		  'zedo',
		  'clicksor',
		  'tiqcdn',
		  'googlesyndication',
		  'adnxs.com',
		  'themoneytizer',
		  'googletagservices',
		  'onetag-sys'
		];
		await page.setRequestInterception(true);
		page.on('request', (request) => {
			const url = request.url();
			// BLOCK ADS & ANALYTICS
			const shouldAbort = blockedResources.some((urlPart) => url.includes(urlPart));
			if (shouldAbort){
				request.abort();
			}
			else
				request.continue();
		});
        await page.goto(urlWebsite, {waitUntil: 'networkidle2'});
        const pageTitle = await page.title();
        await page.close();
        return await pageTitle
    }
    catch(err) {
        await page.close();
		console.log(err)
        return 'error2';
    }
}
app.get("/",function(request, response){
	response.send('Hello World!')
})
app.get("/dotask",function(request, response){
    var _apiResult={'data':'error'}
    var _url=(getSafe(() => request.query.url))
    response.setHeader('content-type', "application/json");
    if(_url){
        if (_url.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)) {
            doTask(browser,_url)
                .then(result => {
                    _apiResult['data']=result
                    response.send(_apiResult)
                })
                .catch(err => {
					console.log(err)
                    //_apiResult['data']=result
                    response.send(_apiResult)
                })
        }
        else{
            _apiResult['data']='invalid url'
            response.send(_apiResult)
        }
    }
    else{
        _apiResult['data']='err2'
        response.send(_apiResult)
    }

    
});
app.listen(process.env.PORT || 82, function(){
	console.log("------------- SERVER START -------------")
});