const puppeteer = require('puppeteer');

async function startBrowser(){
    let browser;
    try{
        console.log("Opening the browser ......");
        browser = await puppeteer.launch({
            headless: false,
            // slowMo: 110,
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true
        });
    }
    catch (erro){
        console.log("Não foi possível criar a instância do chormium =>\n", erro);
    }
    return browser;
}

async function CreateNewpage(browserInstance){
    let newPage;
    try {
        console.log("Tentando criar uma nova página....");
        newPage = await browserInstance.newPage();
    } catch (erro) {
        console.log("Não foi possível abrir uma nova página => ", erro);
    } 
    return newPage;
}

module.exports = {
    startBrowser,
    CreateNewpage
};