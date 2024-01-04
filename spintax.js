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

    return { minLength, maxLength, shortest, longest, tempResult };
}

// Example usage:
let spintaxS = "%%title%% в {онлайн магазин| уеб магазина на|дигитален магазин|е-магазина на} %%sitename%% {Поръчайте със 100% дискретна експресна доставка|Купете с напълно конфиденциална бърза доставка|Заявете днес с изцяло дискретна бърза доставка}. {Границата е само въображението|Няма граници в избора при нас|Не може дори да си представите}! {❤️|💖|❣️} %%page%%";
let spintaxM = "%%title%% в {онлайн магазин| уеб магазина на|дигитален магазин|е-магазина на} %%sitename%% {Поръчайте лесно с 100% дискретна експресна доставка|Купете сега с напълно конфиденциална бърза доставка|Заявете днес с изцяло поверителна бърза доставка}! {❤️|💖|❣️} %%page%%";
let spintaxL = "%%title%% в {онлайн магазин|уеб магазина|онлайн секс шоп|е-магазина на} %%sitename%% {100% дискретна доставка|Конфиденциална доставка|Поверителна бърза доставка}! {❤️|💖|❣️} %%page%%";
//let spintax = " в {онлайн магазин|уеб магазина|онлайн секс шоп|е-магазина на}  {100% дискретна доставка|Конфиденциална доставка|Поверителна бърза доставка}! {❤️|💖|❣️}";

let spintaxFinal = spintaxS;

let minMax = findMinMax(spintaxFinal, 10000);
console.log(`Minimum length: ${minMax.minLength}`);
console.log(`Maximum length: ${minMax.maxLength}`);
console.log(`Shortest result:${minMax.shortest}`);
console.log(`Longest result: ${minMax.longest}`);


