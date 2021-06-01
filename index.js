const browserInstacer = require('./browser');

async function executeHTMLAction(pageInstance, action, elementQuery, secondElementQuery = null){
    try {
        if(secondElementQuery != null)
            await pageInstance[action](elementQuery, secondElementQuery);
        else{
            await pageInstance[action](elementQuery);
        }
    } catch (erro) {
        console.log("Algo deu errado => ", erro);
    }
}

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

// function makeComment(string, markPeople){
//     let result = string;
//     if(markPeople == 1){
//         result = '@' + result;
//     }
//     return result + ' ';
// }

async function writeOnBoxComment(string, HTMLquery, pageInstance){
    await executeHTMLAction(pageInstance, 'type', HTMLquery, string);
}

async function marcarPessoas(theEndOfpharse, string, HTMLquery, pageInstance){
    let commentMaked = '@'+string+theEndOfpharse;
    await writeOnBoxComment(commentMaked, HTMLquery, pageInstance);
}

async function getListOfPeoples(HTMLCollectionOfPeoples){
    let namesForMarked = new Array(HTMLCollectionOfPeoples.length);
    HTMLCollectionOfPeoples.forEach((elemento)=>{
        if(elemento.children[0].children[1].children[0].children[0] == undefined){ //A pessoa não é verificada
            namesForMarked.push(elemento.children[0].children[1].children[0].text);
        }
    });
    return namesForMarked;
}

async function loopOfComents(pageInstance, typeOfSorteio, numOfPeoplesPerComent = 1){
    await pageInstance.waitForSelector('textarea');
    if(typeOfSorteio == 'marcarPessoas'){
        let alfabeto = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
        alfabeto.forEach((elemento)=>{
            writeOnBoxComment('@'+elemento, '[placeholder="Add a comment…"]', pageInstance);
            let HTMLCollectionOfPeoples = await pageInstance.evaluate(()=>{
                return{
                    Perfils: document.getElementsByClassName('[class="Eo_F0   "]')
                }
            });
            let names = getListOfPeoples(HTMLCollectionOfPeoples.Perfils);
            names.forEach((elemento, index)=>{
                if(controlOfLimmitsComment == 60){
                    await delay((61*60*1000)+10000);
                    controlOfLimmitsComment = 0;
                }
                marcarPessoas(' ', elemento, '[placeholder="Add a comment…"]', pageInstance);
                if(index%numOfPeoplesPerComent == 0){
                    await executeHTMLAction(pageInstance, 'click', '[class="sqdOP yWX7d    y3zKF     "]');
                    controlOfLimmitsComment++;
                }
            });
        });
    }
    else if(typeOfSorteio == 'marcarPessoas+comentarioAleatorio'){
        let emojis = [😀,😃,😄,😁,😆,😅,😂,😇,😉,😊,🙂,🙃,☺,😋,😌,😍,🥰,😘,😗,😙,🤪,😚,😜,😝,😡,😠,😟,😞,😳,🤥,🤭,🤫,🤔,🤨,🙄,😒,😑,😐,😶,😏,🤡,🤡,🤗,🤗,🥳,🤠,🧐,🤓,😎,😎,🤑,😛,😔,😕,🙁,☹,😬,🥺,😣,😖,😫,😩,🥱,😤,😮,😱,😰,😯,😦,😧,😢,😥,😪,🤤,😓,☠,💀,👻,👺,💤,😴,🤧,🤒,🤕,😼,🙀,😽,😿,🤲,🚕,🚙,🚌,🚎,🏎,🚓,🚑,🚒,🚚]
        let alfabeto = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
        let controlOfLimmitsComment = 0;
        alfabeto.forEach((elemento)=>{
            writeOnBoxComment('@'+elemento, '[placeholder="Add a comment…"]', pageInstance);
            let HTMLCollectionOfPeoples = await pageInstance.evaluate(()=>{
                return{
                    Perfils: document.getElementsByClassName('[class="Eo_F0   "]')
                }
            });
            let names = getListOfPeoples(HTMLCollectionOfPeoples.Perfils);
            names.forEach((elemento, index)=>{
                if(controlOfLimmitsComment == 60){
                    await delay((61*60*1000)+10000);
                    controlOfLimmitsComment = 0;
                }
                marcarPessoas(' ', elemento + emojis[Math.floor(Math.random()*emojis.length)], '[placeholder="Add a comment…"]', pageInstance);
                if(index%numOfPeoplesPerComent == 0){
                    await executeHTMLAction(pageInstance, 'click', '[class="sqdOP yWX7d    y3zKF     "]');
                    controlOfLimmitsComment++;
                }
            });
        });
        
    }
    else if(typeOfSorteio == 'comentarioAleatorio'){
        let emojis = [😀,😃,😄,😁,😆,😅,😂,😇,😉,😊,🙂,🙃,☺,😋,😌,😍,🥰,😘,😗,😙,🤪,😚,😜,😝,😡,😠,😟,😞,😳,🤥,🤭,🤫,🤔,🤨,🙄,😒,😑,😐,😶,😏,🤡,🤡,🤗,🤗,🥳,🤠,🧐,🤓,😎,😎,🤑,😛,😔,😕,🙁,☹,😬,🥺,😣,😖,😫,😩,🥱,😤,😮,😱,😰,😯,😦,😧,😢,😥,😪,🤤,😓,☠,💀,👻,👺,💤,😴,🤧,🤒,🤕,😼,🙀,😽,😿,🤲,🚕,🚙,🚌,🚎,🏎,🚓,🚑,🚒,🚚];
        for(let i = 0; i < 60; i++){
            await writeOnBoxComment(emojis[Math.floor(Math.random()*emojis.length)], '[placeholder="Add a comment…"]', pageInstance);
            await executeHTMLAction(pageInstance, 'click', '[class="sqdOP yWX7d    y3zKF     "]');
        }
        await delay((61*60*1000)+10000);
    }
    else{
        console.log("O tipo de sorteio escolhido não é suportado por este algoritmo");
    }
}

async function exec(){
    let SoreteioLink = '';
    let newBrowserInstance = await browserInstacer.startBrowser();
    let newPage;
    if(newBrowserInstance != undefined){
        newPage = await newBrowserInstance.newPage();
    };
    if(newPage != undefined){
        await newPage.goto('https://www.instagram.com/');

        await newPage.waitForSelector('button');
        await executeHTMLAction(newPage, 'click', '[class="sqdOP yWX7d    y3zKF     "]');
        await newPage.waitForSelector('input');
        await executeHTMLAction(newPage, 'type', '[id="email"]', 'SeuEmail');
        await executeHTMLAction(newPage, 'type', '[id="pass"]', 'SuaSenha');
        await executeHTMLAction(newPage, 'click', '[id="loginbutton"]');
        await newPage.goto(SoreteioLink);

                


    }
}

 exec();








