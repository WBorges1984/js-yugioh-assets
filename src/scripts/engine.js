const state ={
    score:{
        playerScore: 0,
        computerScore:0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card")
    },
    playerSides: {
        player1: "player-card",
        player1Box: document.querySelector("#player-card"),
        computer: "computer-card",
        computerBox: document.querySelector("#computer-card"),
    },
    actions:{
        button : document.getElementById("next-duel"),
    }
};

const playerSides ={
    player1: "player-card",
    computer: "computer-card",
}
const pathImages = "./src/assets/icons/"
const cardData= [
    {
        id:0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img:`${pathImages}dragon.png`,
        WinOf:[1],
        LoseOf:[2]
    },
    {
        id:1,
        name: "Dark Magician",
        type: "Rock",
        img:`${pathImages}magician.png`,
        WinOf:[2],
        LoseOf:[0]
    },
    {
        id:2,
        name: "Exodia",
        type: "Scissors",
        img:`${pathImages}exodia.png`,
        WinOf:[0],
        LoseOf:[1]
    },
];

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("mouseover", ()=>{
            drawSelectCard(IdCard)
        });
        
        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }


    return cardImage;

}

async function setCardsField(cardId){

    await removeAllCardsImages();

    let computerCardId =  await getRandomCardId();

    await ShowHiddenCardFieldsImages(true);

    await hiddenCardDetails();
    
    await drawCardInfields(cardId, computerCardId);

    let duelReslts = await checkDuelResult(cardId, computerCardId);

    await updateScore();
    await drawButton(duelReslts);
}

async function drawCardInfields(cardID, computerId){
    state.fieldCards.player.src = cardData[cardID].img;
    state.fieldCards.computer.src = cardData[computerId].img;
}

async function ShowHiddenCardFieldsImages(value){
    if(value === true){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }

    if (value === false) {
        state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    }
}

async function hiddenCardDetails(){
    state.cardSprites.name.innerText = ""
    state.cardSprites.type.innerText = ""
    state.cardSprites.avatar.src= "";
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function drawButton(text){
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function checkDuelResult(playerCardID, computerCardId){
    let duelReslts = "Empate";
    let playerCard = cardData[playerCardID];
    if(playerCard.WinOf.includes(computerCardId) ){
        duelReslts = "Win";
        state.score.playerScore++;
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelReslts = "Lose";
        state.score.computerScore++;
    }
    playAudio(duelReslts);
    return duelReslts;
}

async function removeAllCardsImages(){
    let cards = document.querySelector("#computer-card");
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img)=>img.remove());
    
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
    
    
    
    cards = document.querySelector("#player-card");

    imgElements =state.playerSides.player1Box.querySelectorAll("img");
    imgElements.forEach((img)=>img.remove());
}

async function drawSelectCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attibute :" + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide){
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudio(status){
    const audio = new Audio(`../assets/audios/${status}.wav`);
    try {
        audio.play();
    } catch (error) {
        
    }
}

function init(){
    ShowHiddenCardFieldsImages(false);
    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById("bgm");
    
    bgm.play();
}

init();