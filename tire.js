function replaceSpacesWithHyphens(str) {
  return str.replace(/\s+/g, '-');
}


  // Example usage
  let phrase = `Трансфер из ${bulgarianCities[i]} в Стамбул цена`;
  console.log(phrase);
  console.log(replaceSpacesWithHyphens(transliterateBulgarian(phrase)));
  console.log("\n");


  




function transliterateBulgarian(str) {
  const transliterationMap = {
      'А': 'A', 'а': 'a', 'Б': 'B', 'б': 'b', 'В': 'V', 'в': 'v',
      'Г': 'G', 'г': 'g', 'Д': 'D', 'д': 'd', 'Е': 'E', 'е': 'e',
      'Ж': 'Zh', 'ж': 'zh', 'З': 'Z', 'з': 'z', 'И': 'I', 'и': 'i',
      'Й': 'Y', 'й': 'y', 'К': 'K', 'к': 'k', 'Л': 'L', 'л': 'l',
      'М': 'M', 'м': 'm', 'Н': 'N', 'н': 'n', 'О': 'O', 'о': 'o',
      'П': 'P', 'п': 'p', 'Р': 'R', 'р': 'r', 'С': 'S', 'с': 's',
      'Т': 'T', 'т': 't', 'У': 'U', 'у': 'u', 'Ф': 'F', 'ф': 'f',
      'Х': 'H', 'х': 'h', 'Ц': 'Ts', 'ц': 'ts', 'Ч': 'Ch', 'ч': 'ch',
      'Ш': 'Sh', 'ш': 'sh', 'Щ': 'Sht', 'щ': 'sht', 'Ъ': 'A', 'ъ': 'a',
      'Ь': 'Y', 'ь': 'y', 'Ю': 'Yu', 'ю': 'yu', 'Я': 'Ya', 'я': 'ya',
      // Special cases
      'дж': 'dzh', 'дз': 'dz', 'ьо': 'yo', 'йо': 'yo'
  };

  // Handling end-of-word 'ия' rule
  str = str.replace(/ия\b/g, 'ia');

  // Special case for "България"
  if (str === 'България') return 'Bulgaria';

  // Transliterating the string
  return str.split('').map(char => {
      // Checking for special cases
      if (transliterationMap[char + str.charAt(1)]) {
          str = str.slice(1); // Skipping the next character
          return transliterationMap[char + str.charAt(0)];
      }
      return transliterationMap[char] || char;
  }).join('');
}



