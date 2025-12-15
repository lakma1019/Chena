/**
 * Generate image path based on product name and category
 * Images are stored in: frontend/public/images/list/{category}/{filename}.png
 * 
 * @param {string} productName - The name of the product
 * @param {string} category - The category (fruits, low-country-vegetable, up-country-vegetable)
 * @returns {string} - The image path
 */
export const generateImagePath = (productName, category) => {
  if (!productName || !category) {
    return '/images/placeholder.png'; // Fallback image
  }

  // Map category to folder name
  const categoryFolderMap = {
    'fruits': 'fruits',
    'low-country-vegetable': 'low country vegetable',
    'up-country-vegetable': 'up country vegetable'
  };

  const folderName = categoryFolderMap[category] || category;

  // Generate filename from product name
  // Special cases for products with specific filename patterns
  const filenameMap = {
    'Avocado': 'avacado.png',
    'Grapes Red': 'grapes red.png',
    'Mandarin': 'mandarin.png',
    'Narang': 'narang.png',
    'Papaya': 'papaya.png',
    'Passion Fruit': 'passion fruit.png',
    'Pineapple': 'pineapple.png',
    'Pomegranate': 'pomegranate.png',
    'Soursop': 'soursop.png',
    'Star Fruit': 'star fruit.png',
    'Watermelon': 'water melon.png',
    'Wood Apple': 'woodapple.png',
    
    // Low country vegetables
    'Amberella': 'amberella.png',
    'Ash Plantain': 'ash plantain.png',
    'Banana Blossom': 'banana blossom.png',
    'Beans': 'beans.png',
    'Bird Eye Chilli': 'bird eye chilli.png',
    'Bitter Gourd': 'bitter gourd.png',
    'Broccoli': 'broccoli.png',
    'Cucumber': 'cucumber.png',
    'Drumstick': 'drumstick.png',
    'Ginger': 'ginger.png',
    'Ladies Fingers': 'ladies fingers.png',
    'Long Beans': 'long beans.png',
    'Lotus Root': 'lotus root.png',
    'Luffa Gourd': 'luffa gourd.png',
    'Potato': 'potato.png',
    'Pumpkin': 'pumkin.png', // Note: misspelled in filesystem
    'Sarana': 'sarana.png',
    'Sweet Potato': 'sweet potato.png',
    'Thalana Batu': 'thalana batu.png',
    'Tomato': 'tomato.png',
    
    // Up country vegetables
    'Baby Carrot': 'baby carrot.png',
    'Beetroot': 'beetroot.png',
    'Bell Pepper Green': 'bell pepper green.png',
    'Bell Pepper Red': 'bell pepper red.png',
    'Bell Pepper Yellow': 'bell pepper yellow.png',
    'Bok Choy': 'bokchoy.png',
    'Cabbage': 'cabbage.png',
    'Carrot': 'carrot.png',
    'Cauliflower': 'cauli flower.png', // Note: space in filename
    'Celery': 'celery.png',
    'Cucumber Green': 'cucumber green.png',
    'Leeks': 'leaks.png', // Note: misspelled in filesystem
    'Radish Long': 'radish long.png'
  };

  const filename = filenameMap[productName] || `${productName.toLowerCase()}.png`;

  return `/images/list/${folderName}/${filename}`;
};

