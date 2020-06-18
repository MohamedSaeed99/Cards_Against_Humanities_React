const fs = require('fs');
const path = require('path');

const parseCards = () => {
    let rawData = fs.readFileSync(path.resolve(__dirname, './cahcards.json'), (err) => {
        if(err) {
            throw err;
        }
    });
    let cards = JSON.parse(rawData);
    var questionCards = [];

    // filters out question cards with the number of answers needed
    for(var i = 0; i < cards.blackCards.length; i++){
        questionCards.push([cards.blackCards[i].text, cards.blackCards[i].pick]);
    }

    return {
        queCards: questionCards,
        ansCards: cards.whiteCards
    }
}


module.exports = parseCards()