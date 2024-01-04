function parseSpintax(spintax) {
    var match, result = spintax, regex = /\{([^{}]*)\}/;

    while (match = regex.exec(result)) {
        var choices = match[1].split("|");
        result = result.replace(match[0], choices[Math.floor(Math.random() * choices.length)]);
    }

    return result;
}

function countCharacters(text) {
    return text.length;
}

// Function to find the min and max length of parsed spintax
function findMinMax(spintax, iterations) {
    let minLength = Infinity;
    let maxLength = -Infinity;
    let tempResult, tempLength;
    let shortest = '';
    let longest = '';

    for (let i = 0; i < iterations; i++) {
        tempResult = parseSpintax(spintax);
        tempLength = countCharacters(tempResult);
        
        if (tempLength < minLength) {
            minLength = tempLength;
            shortest = tempResult; // Save the shortest result
        }
        if (tempLength > maxLength) {
            maxLength = tempLength;
            longest = tempResult; // Save the longest result
        }
    }

    return { minLength, maxLength, shortest, longest };
}

// Example usage:
let spintax = " в {онлайн магазин| уеб магазина на|дигитален магазин|е-магазина на}  {100% дискретна експресна доставка|Напълно конфиденциална доставка|Поверителна бърза доставка}! {❤️|💖|❣️}";
let spintaxReady = parseSpintax(spintax);
let minMax = findMinMax(spintax, 10000);
console.log(`Minimum length: ${minMax.minLength}`);
console.log(`Maximum length: ${minMax.maxLength}`);
console.log(`Shortest result:${minMax.shortest}`);
console.log(`Longest result: ${minMax.longest}`);

let count = countCharacters(spintaxReady);
