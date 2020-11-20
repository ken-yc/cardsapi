window.onload = function() {
    console.log('ready');

    const queryString = window.location.search;
    const deckId = new URLSearchParams(queryString).get('id');
    document.getElementById('deckId').innerText = deckId;
    
    const xhttp = new XMLHttpRequest();

    document.getElementById('drawCardBtn').addEventListener('click', function() { 
        requestCard(xhttp, deckId, 1);
    });

    document.getElementById('drawFiveBtn').addEventListener('click', function() { 
        emptyList();
        requestCard(xhttp, deckId, 5);
    });

    document.getElementById('shuffleBtn').addEventListener('click', function() {
        emptyList();
        requestShuffle(xhttp, deckId);
    });
}

function requestCard(xhttp, id, cards) {
    
    xhttp.onreadystatechange = function(e) {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
            const cardObj = JSON.parse(xhttp.responseText);
            console.log(cardObj);
            if(cardObj.success) {
                displayCards(cardObj.cards, cardObj.remaining);
            } else {
                displayAlert(cardObj.error);
            }
        } else if(xhttp.status == 500) {
            console.log('Ready State: ' + xhttp.readyState);
            console.log('Status: ' + xhttp.status);
            displayAlert(`Status ${xhttp.status}: Something went wrong!`);
        }
    }
    xhttp.open('GET', `https://deckofcardsapi.com/api/deck/${id}/draw/?count=${cards}`);
    xhttp.send();
}

function requestShuffle(xhttp, id) {
    const cardCount = document.getElementById('cardCount');
    
    xhttp.onreadystatechange = function(e) {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
            const shuffleObj = JSON.parse(xhttp.responseText);
            console.log(shuffleObj);
            if(shuffleObj.success) {
                cardCount.innerText = `Remaining Cards: ${shuffleObj.remaining}`;
                displayInfo('Deck reshuffled!');
            } else {
                displayAlert(shuffleObj.error);
            }
        } else if(xhttp.status == 500) {
            console.log('Ready State: ' + xhttp.readyState);
            console.log('Status: ' + xhttp.status);
            displayAlert(`Status ${xhttp.status}: Something went wrong!`);
        } else {
           displayInfo('Shuffling...');
        }
    }

    xhttp.open('GET', `https://deckofcardsapi.com/api/deck/${id}/shuffle/`);
    xhttp.send();
}

function displayCards(cards, remaining){
    const cardList = document.getElementById('cardList');
    if(cardList.childNodes.length >= 5) {
        emptyList();
    }

    const cardCount = document.getElementById('cardCount');
    cardCount.innerText = `Remaining Cards: ${remaining}`;

    const cardLog = document.getElementById('cardLog');
    let cardLogStr = cardLog.innerText;
    for(let card of cards) {
        const cardContainer = document.createElement('div');
        cardContainer.setAttribute('class', 'col-2');
        
        const cardImg = document.createElement('img');
        cardImg.src = card.image;
        
        cardContainer.appendChild(cardImg);
        cardList.appendChild(cardContainer);
        cardLogStr += `${card.value} of ${card.suit} has been drawn. \n`;
    }
    cardLog.innerText = cardLogStr;
}



function displayInfo(msg){
    const infoMsg = document.getElementById('infoMsg');
    infoMsg.innerText = msg;
    infoMsg.style.display = 'block';
    setTimeout(function(){
        infoMsg.style.display = 'none';
    }, 5000);
}

function emptyList(){
    document.getElementById('cardList').innerHTML = '';
    document.getElementById('cardLog').innerHTML = '';
}