const puppeteer = require('puppeteer');
 
(async () => {
  const browser = await puppeteer.launch(
  	{
  		headless: false,
  		sloMo: 250,
  		devtools: true
  	});
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on('request', interceptedRequest => {
    if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg'))
      console.log(interceptedRequest);
    //else
      //interceptedRequest.continue();

  });

  await page.goto('https://www.pgatour.com/');
  console.log(page.tracing);
  await page.evaluate(() => {debugger;});
  //await page.screenshot({path: 'example.png'});
  listener = await page.on('response', response => {
  			const request = response.request();
  			const resourceType = request.resourceType();
            console.log(request);
            //const isXhr = ['xhr','fetch'].includes(response.request().resourceType())
            //if (isXhr){
                //console.log(response.url());
                //response.text().then(log)
            //}
        });
  await browser.close();
})();