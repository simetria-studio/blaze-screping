const cron = require("node-cron");
const express = require("express");
const puppeteer = require('puppeteer');
const axios = require('axios');

app = express();

// Setar um tempo para  apagina demorra a fechar, não é necessario
async function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapping() {
  // const browser = await puppeteer.launch( {executablePath: '/usr/bin/chromium-browser', headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"]} );
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage(); // Abrindo uma pagina
  await page.goto('https://blaze.com/pt/games/double');
  // await timeout(8000);
  // await page.screenshot({path: 'teste.png', fullPage: true});
  // await page.pdf({path: 'hn.pdf', format: 'A4'});

  // Fazemos uma leitura na pagina para recuperar os dados
  let dadosTemp = await page.evaluate(async () => {
    var nodeList = [];
    var innerHTML = [];

    // Pegando os dados
    nodeList = document.querySelector('#roulette-recent').querySelectorAll('.roulette-tile');

    // Lendo o node para formatar os dados
    for (var i = 0; i < nodeList.length; i++) {
      innerHTML.push({ number: nodeList[i].childNodes[0].childNodes[0].textContent ?? '', class_name: (nodeList[i].childNodes[0].className).replace('sm-box', '') });
    }

    return innerHTML;
  });

  console.log(dadosTemp);
 
  axios.post('http://localhost:8000/scraping', dadosTemp).then(res => {
    // console.log(res);
  }).catch(error => {
    console.error(error)
  });



  await browser.close();
}

scrapping();

// cron.schedule("0 2 * * *", () => scrapping());

// app.listen(1313);