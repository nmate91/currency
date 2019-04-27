exports.handler = async (event) => {

    const request = require('request');
    const base = 'HUF';
    const urlLatest = `https://api.exchangeratesapi.io/latest?base=${base}`;
    const yesterDay = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const urlYesterday = `https://api.exchangeratesapi.io/${yesterDay}?base=${base}`;
    const promiseLatest = new Promise((resolve, reject) => {
        request.get({
            url: urlLatest,
            json: true,
            headers: {'User-Agent': 'request'}
        }, (err, res, data) => {
            if (err)
                reject(err);
            resolve(data);
        });
    });

    const promiseYesterDay = new Promise((resolve, reject) => {
        request.get({
            url: urlYesterday,
            json: true,
            headers: {'User-Agent': 'request'}
        }, (err, res, data) => {
            if (err)
                reject(err);
            resolve(data);
        });
    });
    const responseLatest = await promiseLatest;
    const responseYesterday = await promiseYesterDay;

    let rates = Object.keys(responseLatest.rates).map(currency => {
       return {
           currency: currency,
           rate: responseLatest.rates[currency] / responseYesterday.rates[currency]
       };
    });
    return rates;
};

//this should be removed before uploading to lambda
this.handler();