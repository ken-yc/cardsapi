window.onload = function() {
    console.log("script ready");

    document.getElementById('newDeck').addEventListener('click', function(){
        console.log("new button clicked");

        const decks = document.getElementById('numDecks').value;

        if(decks >= 1){
            console.log(decks);
            requestDeck(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${decks}`);
        } else {
            console.log("invalid number of decks.");
        }
    });

    document.getElementById('oldDeck').addEventListener('click', function(){
        console.log("old button clicked");

        const id = document.getElementById('deckId').value;

        if(id){
            console.log(id);
            requestDeck(`https://deckofcardsapi.com/api/deck/${id}/`);
        } else {
            console.log("invalid deck id.");
        }
    });
    
};

function requestDeck(url) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(e) {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
            toggleLoading();
            const deckObj = JSON.parse(xhttp.responseText);
            if(deckObj.success) {
                const deckId = deckObj.deck_id;
                console.log(deckId);
                window.location.href=`deck.html?id=${deckId}`;
            } else { 
                displayAlert(deckObj.error);
            }
            
        } else if(xhttp.status == 500) {
            console.log('Ready State: ' + xhttp.readyState);
            console.log('Status: ' + xhttp.status);
            toggleLoading();
            displayAlert('Unable to retrieve deck. Please try again.');
        } else {
            toggleLoading();
        }
    }

    xhttp.open('GET', url);

    xhttp.send();
}

function toggleLoading(){
    let loader = document.getElementById('loading');
    loader = loader.getElementsByClassName('overlay');
    const style = getComputedStyle(loader[0]);
    if(style.display == 'none')
        loader[0].style.display = 'block';
    else
        loader[0].style.display = 'none';
}

function displayAlert(msg){
    const alert = document.getElementById('alertMsg');
    alert.innerText = msg;
    alert.style.display = 'block';
    setTimeout(function(){
        alert.style.display = 'none';
    }, 5000);
}