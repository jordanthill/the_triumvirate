"use client";

import { useState } from "react";
import Link from "next/link";

// Chemical reaction types
interface ChemicalReaction {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  chemistryExplanation: string;
}

interface MealPlan {
  reaction: ChemicalReaction;
  appetizer: Recipe;
  mainDish: Recipe;
}

// Culinary chemical reactions
const REACTIONS: ChemicalReaction[] = [
  {
    id: "maillard",
    name: "Maillard Reaction",
    description: "The complex browning reaction between amino acids and reducing sugars that creates rich, savory flavors and golden-brown colors.",
    icon: "🔥",
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    id: "caramelization",
    name: "Caramelization",
    description: "The oxidation of sugar at high heat, creating complex flavors and deep amber colors without proteins.",
    icon: "🍯",
    color: "from-yellow-500/20 to-amber-500/20",
  },
  {
    id: "emulsification",
    name: "Emulsification",
    description: "The process of combining two immiscible liquids (like oil and water) into a stable mixture using an emulsifier.",
    icon: "🥚",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "fermentation",
    name: "Fermentation",
    description: "Microorganisms breaking down carbohydrates to produce acids, gases, or alcohol, transforming flavors and textures.",
    icon: "🦠",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: "denaturation",
    name: "Protein Denaturation",
    description: "Heat or acid causing proteins to unfold and restructure, changing texture from liquid to solid (like cooking eggs).",
    icon: "🥩",
    color: "from-red-500/20 to-pink-500/20",
  },
  {
    id: "gelatinization",
    name: "Gelatinization",
    description: "Starch granules absorbing water and swelling when heated, creating thickness and structure in sauces and baked goods.",
    icon: "🌾",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: "enzymatic",
    name: "Enzymatic Browning",
    description: "Enzymes in fruits and vegetables reacting with oxygen to create brown pigments when cells are damaged.",
    icon: "🍎",
    color: "from-rose-500/20 to-red-500/20",
  },
  {
    id: "reduction",
    name: "Reduction",
    description: "Evaporating water from a liquid to concentrate flavors and thicken consistency through sustained simmering.",
    icon: "🍷",
    color: "from-violet-500/20 to-purple-500/20",
  },
];

// Recipe database organized by chemical reaction
const RECIPE_DATABASE: Record<string, { appetizers: Recipe[]; mains: Recipe[] }> = {
  maillard: {
    appetizers: [
      {
        name: "Seared Scallops with Brown Butter",
        ingredients: [
          "6 large sea scallops",
          "2 tbsp butter",
          "Salt and pepper",
          "Fresh thyme",
          "Lemon wedges",
        ],
        instructions: [
          "Pat scallops completely dry with paper towels",
          "Season generously with salt and pepper",
          "Heat a stainless steel pan over high heat until very hot",
          "Add scallops and sear for 2 minutes without moving",
          "Flip and sear for another 1-2 minutes until golden crust forms",
          "Add butter and thyme, baste scallops as butter browns",
          "Serve immediately with lemon wedges",
        ],
        chemistryExplanation:
          "The Maillard reaction occurs when the scallops hit the hot pan. The proteins and sugars on the surface react at high heat (300°F+), creating hundreds of flavor compounds and the characteristic golden-brown crust. The brown butter undergoes a similar reaction, where milk proteins caramelize, adding nutty complexity.",
      },
      {
        name: "Roasted Garlic Crostini",
        ingredients: [
          "1 baguette, sliced",
          "1 whole garlic bulb",
          "3 tbsp olive oil",
          "Fresh rosemary",
          "Sea salt",
        ],
        instructions: [
          "Preheat oven to 400°F",
          "Cut top off garlic bulb, drizzle with oil, wrap in foil",
          "Roast garlic for 40 minutes until caramelized",
          "Brush bread slices with oil and toast until golden",
          "Squeeze roasted garlic onto crostini",
          "Garnish with rosemary and sea salt",
        ],
        chemistryExplanation:
          "Both the bread and garlic undergo Maillard browning. The bread's proteins and sugars create a crispy, flavorful crust. The garlic's amino acids react with its natural sugars at high heat, transforming harsh, pungent allicin compounds into sweet, mellow, caramelized flavors.",
      },
      {
        name: "Crispy Roasted Brussels Sprouts",
        ingredients: [
          "1 lb Brussels sprouts, halved",
          "3 tbsp olive oil",
          "Salt and pepper",
          "Parmesan cheese, grated",
          "Balsamic glaze",
        ],
        instructions: [
          "Preheat oven to 425°F",
          "Toss Brussels sprouts with oil, salt, and pepper",
          "Roast cut-side down for 25-30 minutes until deeply browned",
          "Toss with fresh parmesan",
          "Drizzle with balsamic glaze before serving",
        ],
        chemistryExplanation:
          "The cut surfaces of Brussels sprouts undergo intense Maillard browning when in direct contact with the hot pan. Natural sugars and amino acids react at high heat, creating hundreds of new flavor compounds. This transforms bitter, sulfurous sprouts into sweet, nutty, caramelized bites with crispy browned edges.",
      },
      {
        name: "Grilled Shrimp Skewers",
        ingredients: [
          "1 lb large shrimp, peeled and deveined",
          "2 tbsp olive oil",
          "1 tbsp paprika",
          "1 tsp garlic powder",
          "Salt and pepper",
          "Lemon wedges",
        ],
        instructions: [
          "Thread shrimp onto skewers",
          "Brush with olive oil and season with spices",
          "Grill over high heat 2-3 minutes per side",
          "Look for char marks and pink color",
          "Serve immediately with lemon wedges",
        ],
        chemistryExplanation:
          "Shrimp proteins denature and brown simultaneously on the grill. The high heat (400°F+) creates Maillard browning on the surface while the interior cooks gently. The char marks are concentrated areas where Maillard products form most intensely, creating smoky, savory notes.",
      },
      {
        name: "Roasted Spiced Nuts",
        ingredients: [
          "2 cups mixed nuts",
          "2 tbsp butter, melted",
          "2 tbsp soy sauce",
          "1 tbsp brown sugar",
          "1 tsp cayenne pepper",
        ],
        instructions: [
          "Preheat oven to 350°F",
          "Melt butter with soy sauce and brown sugar",
          "Toss nuts with the mixture and cayenne",
          "Roast for 15-20 minutes, stirring occasionally",
          "Let cool to crisp up",
        ],
        chemistryExplanation:
          "Nuts contain both proteins and sugars that brown beautifully through the Maillard reaction. The soy sauce adds additional amino acids (glutamates), intensifying the browning and umami flavors. The combination of nut proteins, added sugars, and high heat creates deeply savory, complex flavors.",
      },
    ],
    mains: [
      {
        name: "Pan-Seared Ribeye Steak",
        ingredients: [
          "1 ribeye steak (1.5 inches thick)",
          "2 tbsp vegetable oil",
          "4 tbsp butter",
          "4 garlic cloves, crushed",
          "Fresh thyme and rosemary",
          "Salt and pepper",
        ],
        instructions: [
          "Bring steak to room temperature, pat dry thoroughly",
          "Season generously with salt and pepper",
          "Heat cast iron skillet over high heat until smoking",
          "Add oil and steak, sear 3-4 minutes without moving",
          "Flip and sear another 3-4 minutes",
          "Add butter, garlic, and herbs; baste steak continuously",
          "Rest for 5-10 minutes before serving",
        ],
        chemistryExplanation:
          "The Maillard reaction is responsible for the steak's dark, flavorful crust. At temperatures above 300°F, amino acids from the meat's proteins react with reducing sugars, creating melanoidins (brown pigments) and hundreds of volatile compounds that give steak its characteristic 'meaty' flavor. Dry surface and high heat are crucial for maximum browning.",
      },
      {
        name: "Crispy Roasted Chicken Thighs",
        ingredients: [
          "6 bone-in chicken thighs",
          "2 tbsp olive oil",
          "1 tbsp paprika",
          "2 tsp garlic powder",
          "Salt and pepper",
          "Fresh herbs",
        ],
        instructions: [
          "Preheat oven to 425°F",
          "Pat chicken completely dry",
          "Rub with oil and season generously",
          "Place skin-side up on a wire rack over baking sheet",
          "Roast for 35-40 minutes until skin is deeply golden and crispy",
          "Let rest 5 minutes before serving",
        ],
        chemistryExplanation:
          "The chicken skin undergoes intense Maillard browning in the hot oven. The proteins in the skin react with naturally present sugars and rendered fat, creating a deeply flavored, crispy exterior. The dry heat allows moisture to evaporate, concentrating the reaction at the surface and preventing steaming, which would inhibit browning.",
      },
      {
        name: "Seared Pork Chops with Pan Sauce",
        ingredients: [
          "4 thick-cut pork chops",
          "2 tbsp vegetable oil",
          "1 cup chicken stock",
          "2 tbsp butter",
          "Fresh sage leaves",
          "Salt and pepper",
        ],
        instructions: [
          "Season pork chops generously with salt and pepper",
          "Sear in hot pan 4-5 minutes per side until deeply browned",
          "Remove chops and rest",
          "Deglaze pan with chicken stock, scraping up brown bits",
          "Reduce sauce, mount with butter and sage",
          "Serve sauce over chops",
        ],
        chemistryExplanation:
          "The pork chops develop a beautiful Maillard crust where proteins and sugars create complex flavors. The fond (brown bits) left in the pan is concentrated Maillard compounds—hundreds of savory molecules that dissolve into the sauce, creating rich, meaty depth that amplifies the pork's natural flavors.",
      },
      {
        name: "Classic Beef Burgers",
        ingredients: [
          "1.5 lbs ground beef (80/20)",
          "Salt and pepper",
          "4 burger buns",
          "Cheese slices",
          "Lettuce, tomato, onion",
          "Condiments of choice",
        ],
        instructions: [
          "Form beef into 4 patties, season generously",
          "Grill or pan-fry over high heat 3-4 minutes per side",
          "Don't press down on the patties!",
          "Add cheese in the last minute",
          "Toast buns lightly",
          "Assemble with toppings",
        ],
        chemistryExplanation:
          "Ground beef has maximum surface area exposed for Maillard reaction. The high heat of the grill creates a deeply browned crust packed with hundreds of savory flavor compounds. The reaction between amino acids and sugars creates the characteristic 'grilled' flavor. The char adds additional carbonized notes.",
      },
    ],
  },
  caramelization: {
    appetizers: [
      {
        name: "Caramelized Onion Tart",
        ingredients: [
          "1 sheet puff pastry",
          "3 large onions, thinly sliced",
          "2 tbsp butter",
          "1 tbsp brown sugar",
          "2 tbsp balsamic vinegar",
          "Goat cheese",
          "Fresh thyme",
        ],
        instructions: [
          "Cook onions in butter over medium-low heat for 30-40 minutes, stirring occasionally",
          "Add sugar and vinegar in the last 5 minutes",
          "Roll out puff pastry and dock with a fork",
          "Spread caramelized onions on pastry, crumble goat cheese on top",
          "Bake at 400°F for 20 minutes until golden",
          "Garnish with fresh thyme",
        ],
        chemistryExplanation:
          "Pure caramelization occurs as the onions' natural sugars (sucrose, fructose, glucose) break down under prolonged heat. Above 320°F, sugar molecules decompose and recombine into hundreds of new compounds, creating sweet, bitter, and nutty flavors. The brown color comes from polymers formed during this process. No proteins are involved—this is purely sugar chemistry.",
      },
      {
        name: "Roasted Carrot Soup",
        ingredients: [
          "2 lbs carrots, chopped",
          "1 onion, diced",
          "4 cups vegetable stock",
          "1/2 cup cream",
          "2 tbsp honey",
          "Ground cumin",
          "Salt and pepper",
        ],
        instructions: [
          "Roast carrots at 425°F for 30-35 minutes until caramelized",
          "Sauté onion in a pot",
          "Add roasted carrots and stock, simmer 10 minutes",
          "Blend until smooth",
          "Stir in cream and honey, season with cumin",
        ],
        chemistryExplanation:
          "Carrots contain high levels of natural sugars that caramelize beautifully when roasted at high heat. The sugar molecules break down and create deep, sweet, complex flavors that transform the soup from simple to sophisticated. The honey adds additional caramelized notes.",
      },
      {
        name: "Candied Pecans",
        ingredients: [
          "2 cups pecan halves",
          "1/2 cup brown sugar",
          "2 tbsp butter",
          "1 tsp cinnamon",
          "1/4 tsp cayenne",
          "Pinch of salt",
        ],
        instructions: [
          "Melt butter in pan over medium heat",
          "Add brown sugar and stir until dissolved",
          "Add pecans, cinnamon, cayenne",
          "Cook 5-7 minutes, stirring constantly",
          "Spread on parchment to cool",
        ],
        chemistryExplanation:
          "The brown sugar undergoes caramelization as it melts and heats above 320°F. The sugar molecules decompose and reform into hundreds of new compounds, creating complex sweet and bitter notes. The pecans toast while being coated, adding nutty depth.",
      },
      {
        name: "Balsamic Roasted Figs with Cheese",
        ingredients: [
          "12 fresh figs, halved",
          "3 tbsp balsamic vinegar",
          "2 tbsp honey",
          "Goat cheese or blue cheese",
          "Walnuts, chopped",
          "Fresh thyme",
        ],
        instructions: [
          "Preheat oven to 400°F",
          "Place figs cut-side up on baking sheet",
          "Drizzle with balsamic and honey",
          "Roast 15-20 minutes until caramelized",
          "Top with crumbled cheese and walnuts",
        ],
        chemistryExplanation:
          "Fresh figs contain high levels of natural sugars that caramelize in the oven's heat. The honey and balsamic vinegar also undergo caramelization, creating layers of sweet-tart complexity. The heat concentrates the sugars and creates new aromatic compounds.",
      },
    ],
    mains: [
      {
        name: "Duck Breast with Caramel Gastrique",
        ingredients: [
          "2 duck breasts",
          "1 cup sugar",
          "1/2 cup red wine vinegar",
          "1/4 cup orange juice",
          "Salt and pepper",
        ],
        instructions: [
          "Score duck skin in a crosshatch pattern",
          "Place skin-side down in cold pan, bring to medium heat",
          "Cook 6-8 minutes until skin is crispy, flip and cook 2-3 minutes",
          "For gastrique: melt sugar in a pan until amber colored",
          "Carefully add vinegar and orange juice (it will splatter)",
          "Simmer until syrupy, season with salt",
          "Slice duck and drizzle with gastrique",
        ],
        chemistryExplanation:
          "The gastrique showcases pure caramelization. When sugar is heated above its melting point (320°F), it undergoes thermal decomposition—breaking down into hundreds of compounds including caramel, diacetyl, and furans. These create complex sweet-bitter flavors. The acidity from vinegar stops the reaction and adds balance. The duck skin also experiences some caramelization of its natural sugars alongside Maillard browning.",
      },
      {
        name: "Honey-Glazed Pork Tenderloin",
        ingredients: [
          "1 pork tenderloin",
          "1/4 cup honey",
          "2 tbsp soy sauce",
          "1 tbsp Dijon mustard",
          "2 cloves garlic, minced",
        ],
        instructions: [
          "Preheat oven to 400°F",
          "Sear tenderloin in hot pan on all sides",
          "Mix honey, soy sauce, mustard, and garlic",
          "Brush glaze on pork and roast for 15-20 minutes",
          "Brush with glaze every 5 minutes",
          "Let rest before slicing",
        ],
        chemistryExplanation:
          "Honey, being primarily fructose and glucose, caramelizes beautifully in the oven's heat. The sugars break down and form new flavor compounds, creating a glossy, deeply flavored crust. The repeated glazing layers these caramelized sugars, building complexity. Some Maillard reaction also occurs between the honey and the pork's proteins.",
      },
      {
        name: "Maple-Glazed Salmon",
        ingredients: [
          "4 salmon fillets",
          "1/4 cup pure maple syrup",
          "2 tbsp soy sauce",
          "1 clove garlic, minced",
          "1 tsp grated ginger",
          "Sesame seeds",
        ],
        instructions: [
          "Mix maple syrup, soy sauce, garlic, and ginger",
          "Brush mixture on salmon fillets",
          "Broil for 8-10 minutes, basting every 3 minutes",
          "Watch carefully to prevent burning",
          "Sprinkle with sesame seeds before serving",
        ],
        chemistryExplanation:
          "Maple syrup's concentrated sugars (primarily sucrose and fructose) caramelize under the broiler's intense heat. The sugars decompose and recombine above 320°F, creating deep, complex sweet-savory notes. The soy sauce adds umami that complements the caramelization, while repeated basting builds layers of caramelized glaze.",
      },
    ],
  },
  emulsification: {
    appetizers: [
      {
        name: "Classic Caesar Salad",
        ingredients: [
          "Romaine lettuce",
          "2 egg yolks",
          "2 cloves garlic",
          "4 anchovy fillets",
          "1 tbsp Dijon mustard",
          "Juice of 1 lemon",
          "3/4 cup olive oil",
          "Parmesan cheese",
          "Croutons",
        ],
        instructions: [
          "Mince garlic and anchovies into a paste",
          "Whisk together egg yolks, garlic paste, mustard, and lemon juice",
          "While whisking constantly, slowly drizzle in olive oil",
          "Continue until thick and creamy emulsion forms",
          "Toss with chopped romaine, parmesan, and croutons",
        ],
        chemistryExplanation:
          "The egg yolk is the emulsifier here, containing lecithin—a phospholipid with both water-loving (hydrophilic) and oil-loving (hydrophobic) ends. As you whisk, lecithin molecules surround tiny oil droplets, with their hydrophobic tails pointing inward and hydrophilic heads pointing outward into the water phase. This prevents the oil droplets from coalescing, creating a stable emulsion (mayonnaise). The mustard also contains emulsifiers that help stabilize the mixture.",
      },
      {
        name: "Homemade Aioli with Vegetables",
        ingredients: [
          "2 egg yolks",
          "3 cloves garlic, minced",
          "1 cup extra virgin olive oil",
          "Juice of 1 lemon",
          "Salt",
          "Assorted raw vegetables",
        ],
        instructions: [
          "Whisk egg yolks, garlic, and a pinch of salt",
          "Add oil drop by drop while whisking constantly",
          "Once thickened, add oil in a thin stream",
          "Whisk in lemon juice and adjust seasoning",
          "Serve with sliced vegetables",
        ],
        chemistryExplanation:
          "Aioli is a classic emulsion demonstration. The egg yolk's lecithin molecules act as surfactants, reducing surface tension between oil and water. Each oil droplet becomes coated with lecithin, suspended in the water phase from the lemon juice and eggs. The slow addition of oil is crucial—adding too much too fast overwhelms the emulsifier's capacity, causing the emulsion to 'break' and separate.",
      },
    ],
    mains: [
      {
        name: "Salmon with Beurre Blanc",
        ingredients: [
          "4 salmon fillets",
          "1/2 cup white wine",
          "2 tbsp white wine vinegar",
          "2 shallots, minced",
          "1 cup cold butter, cubed",
          "Salt and white pepper",
        ],
        instructions: [
          "Season and pan-sear salmon, set aside",
          "Simmer wine, vinegar, and shallots until reduced to 2 tbsp",
          "Remove from heat, whisk in butter one cube at a time",
          "Return to very low heat as needed, never boiling",
          "Season sauce and serve over salmon",
        ],
        chemistryExplanation:
          "Beurre blanc is a warm butter emulsion. The reduced wine provides water and acidity, while butter contributes fat and milk proteins. The gentle whisking breaks butter into tiny droplets, and the milk proteins act as emulsifiers, stabilizing the mixture. Temperature control is critical—too hot and the proteins denature, breaking the emulsion; too cool and the butter solidifies. The result is a velvety, glossy sauce that defies oil-and-water separation.",
      },
      {
        name: "Pan-Seared Chicken with Lemon Butter Sauce",
        ingredients: [
          "4 chicken breasts",
          "1/2 cup chicken stock",
          "Juice of 2 lemons",
          "6 tbsp cold butter",
          "2 cloves garlic",
          "Fresh parsley",
        ],
        instructions: [
          "Sear seasoned chicken until golden, set aside",
          "Deglaze pan with stock and lemon juice, add garlic",
          "Reduce by half",
          "Remove from heat, whisk in cold butter piece by piece",
          "Return chicken to pan, coat with sauce",
          "Garnish with parsley",
        ],
        chemistryExplanation:
          "This pan sauce is a quick emulsion where butter is incorporated into an acidic liquid. The butter's milk proteins and the gentle agitation create an emulsion of fat droplets suspended in the stock. The acid from lemon juice helps stabilize the emulsion by affecting the protein structure. The cold butter is key—it slowly melts while being whisked, allowing proper emulsification rather than separation.",
      },
    ],
  },
  fermentation: {
    appetizers: [
      {
        name: "Sourdough Bruschetta",
        ingredients: [
          "Sourdough bread, sliced",
          "4 ripe tomatoes, diced",
          "Fresh basil",
          "2 cloves garlic",
          "Olive oil",
          "Balsamic vinegar",
        ],
        instructions: [
          "Grill or toast sourdough slices until charred",
          "Rub with cut garlic clove",
          "Mix tomatoes, basil, olive oil, and vinegar",
          "Top bread with tomato mixture",
          "Drizzle with extra olive oil",
        ],
        chemistryExplanation:
          "Sourdough bread is created through lacto-fermentation. Wild yeasts and lactic acid bacteria consume the flour's sugars, producing carbon dioxide (for rise), lactic acid (for tang), and acetic acid (for depth). This fermentation process also breaks down gluten and phytic acid, making the bread more digestible. The complex flavors and tangy notes are direct products of bacterial metabolism over 12-24 hours.",
      },
      {
        name: "Kimchi Pancakes",
        ingredients: [
          "1 cup kimchi, chopped",
          "1/2 cup kimchi juice",
          "1 cup flour",
          "1 egg",
          "1/4 cup water",
          "2 scallions, chopped",
          "Vegetable oil",
        ],
        instructions: [
          "Mix flour, egg, kimchi juice, and water into batter",
          "Fold in kimchi and scallions",
          "Heat oil in pan over medium-high heat",
          "Pour batter to form pancakes",
          "Fry until golden on both sides, 3-4 minutes per side",
          "Serve with dipping sauce",
        ],
        chemistryExplanation:
          "Kimchi is fermented by Lactobacillus bacteria that convert cabbage sugars into lactic acid, creating the characteristic sour taste. The bacteria also produce amino acids and vitamins, enhancing nutrition. During fermentation, complex carbohydrates break down, and new umami compounds form through protein breakdown. The tangy, funky flavor comes from organic acids, while the 'bite' comes from capsaicin in the chili peppers.",
      },
    ],
    mains: [
      {
        name: "Miso-Glazed Salmon",
        ingredients: [
          "4 salmon fillets",
          "1/4 cup white miso paste",
          "2 tbsp mirin",
          "2 tbsp sake",
          "1 tbsp sugar",
          "1 tbsp soy sauce",
        ],
        instructions: [
          "Mix miso, mirin, sake, sugar, and soy sauce",
          "Marinate salmon for 2-24 hours",
          "Preheat broiler",
          "Wipe excess marinade off salmon",
          "Broil for 8-10 minutes until caramelized and cooked through",
        ],
        chemistryExplanation:
          "Miso is created by fermenting soybeans with koji mold (Aspergillus oryzae). The mold's enzymes break down proteins into amino acids (especially glutamates, creating umami) and starches into simple sugars. This fermentation can last months to years, developing complex, savory depth. The glutamates in miso interact with taste receptors on your tongue, triggering that characteristic 'fifth taste' sensation of umami.",
      },
      {
        name: "Beer-Braised Brisket",
        ingredients: [
          "3 lb beef brisket",
          "2 bottles dark beer",
          "2 onions, sliced",
          "4 carrots",
          "4 cloves garlic",
          "Fresh thyme and bay leaves",
          "Salt and pepper",
        ],
        instructions: [
          "Sear seasoned brisket on all sides",
          "Add onions, carrots, and garlic to pot",
          "Pour in beer, add herbs",
          "Cover and braise at 300°F for 3-4 hours",
          "Remove brisket, reduce braising liquid",
          "Slice and serve with sauce",
        ],
        chemistryExplanation:
          "Beer is produced through yeast fermentation of malted barley. Yeast converts sugars into alcohol and CO₂, while also creating esters and phenols that contribute flavor. The beer's acidity and alcohol help tenderize the brisket's connective tissue. The malty sweetness comes from caramelized sugars in the malting process, while hops add bitterness and aromatic compounds. These fermentation byproducts infuse the meat during the slow braise.",
      },
    ],
  },
  denaturation: {
    appetizers: [
      {
        name: "Soft-Boiled Eggs with Soldiers",
        ingredients: [
          "4 eggs",
          "4 slices bread",
          "Butter",
          "Sea salt and pepper",
          "Fresh chives",
        ],
        instructions: [
          "Bring water to a boil",
          "Gently lower eggs into water",
          "Boil for exactly 6 minutes",
          "Transfer to ice bath for 1 minute",
          "Toast bread and cut into strips ('soldiers')",
          "Peel eggs, season, and serve with buttered toast",
        ],
        chemistryExplanation:
          "Egg protein denaturation is temperature-dependent. At 140°F, the yolk begins to thicken but remains liquid. At 158°F, the white fully denatures and sets, transforming from clear liquid to opaque white solid as proteins unfold and bond together. The 6-minute timing achieves set whites (completely denatured) while keeping the yolk runny (partially denatured), creating the perfect textural contrast.",
      },
      {
        name: "Ceviche",
        ingredients: [
          "1 lb fresh white fish (halibut or sea bass)",
          "1 cup fresh lime juice",
          "1/2 red onion, thinly sliced",
          "1 jalapeño, minced",
          "Cilantro",
          "Salt",
          "Avocado for serving",
        ],
        instructions: [
          "Dice fish into 1/2-inch cubes",
          "Toss with lime juice and salt",
          "Refrigerate for 15-20 minutes until opaque",
          "Drain most of the lime juice",
          "Mix with onion, jalapeño, and cilantro",
          "Serve immediately with avocado",
        ],
        chemistryExplanation:
          "Ceviche demonstrates acid-induced protein denaturation. The lime juice's citric acid (pH ~2) causes the fish's proteins to unfold and restructure, just like heat does. The muscle proteins denature, turning the translucent flesh opaque and firm. However, unlike cooking with heat, this process doesn't kill all bacteria, which is why extremely fresh fish is essential. The texture is slightly different from heat-cooked fish because acid denaturation creates a firmer, more compact protein structure.",
      },
    ],
    mains: [
      {
        name: "Perfect Scrambled Eggs",
        ingredients: [
          "8 eggs",
          "4 tbsp butter",
          "1/4 cup heavy cream",
          "Salt and pepper",
          "Fresh chives",
        ],
        instructions: [
          "Whisk eggs, cream, salt, and pepper",
          "Melt butter in pan over low heat",
          "Add eggs and stir constantly with a spatula",
          "Remove from heat while still slightly wet (carryover cooking)",
          "Eggs should be creamy and soft-set",
          "Garnish with chives and serve immediately",
        ],
        chemistryExplanation:
          "Scrambled eggs are all about controlled protein denaturation. Egg proteins begin denaturing around 140°F. Low heat and constant stirring ensure gradual, gentle denaturation, creating small protein curds—the hallmark of creamy scrambled eggs. High heat causes rapid denaturation, forming large, tough curds and releasing moisture. The butter and cream slow heat transfer and add fat, which coats the proteins and prevents them from bonding too tightly, maintaining that silky texture.",
      },
      {
        name: "Yogurt-Marinated Grilled Chicken",
        ingredients: [
          "4 chicken breasts",
          "1 cup plain yogurt",
          "3 cloves garlic, minced",
          "2 tsp paprika",
          "1 tsp cumin",
          "Juice of 1 lemon",
          "Salt and pepper",
        ],
        instructions: [
          "Mix yogurt, garlic, spices, lemon juice, salt, and pepper",
          "Marinate chicken for 4-24 hours",
          "Preheat grill to medium-high",
          "Remove excess marinade and grill chicken 6-7 minutes per side",
          "Let rest before serving",
        ],
        chemistryExplanation:
          "The yogurt's lactic acid (pH ~4.5) denatures the chicken's surface proteins during marinating, breaking down the muscle structure and tenderizing the meat. This is similar to ceviche but milder due to lower acidity. When grilled, heat causes further protein denaturation throughout the meat—myosin denatures at 122°F, actin at 140-150°F, and collagen begins converting to gelatin at 160°F+. The yogurt coating also helps retain moisture during cooking.",
      },
    ],
  },
  gelatinization: {
    appetizers: [
      {
        name: "Creamy Polenta Cakes",
        ingredients: [
          "1 cup polenta (coarse cornmeal)",
          "4 cups water or stock",
          "1/2 cup parmesan",
          "2 tbsp butter",
          "Salt and pepper",
          "Olive oil for frying",
        ],
        instructions: [
          "Bring liquid to a boil, whisk in polenta slowly",
          "Reduce heat and stir frequently for 30-40 minutes",
          "Stir in parmesan and butter",
          "Pour into a greased pan, refrigerate until firm",
          "Cut into rounds and pan-fry until golden",
        ],
        chemistryExplanation:
          "Polenta showcases starch gelatinization perfectly. Corn starch granules are crystalline and indigestible when raw. As they heat in water above 158°F, the granules absorb water and swell dramatically (up to 30x their size). The crystalline structure breaks down, releasing amylose and amylopectin molecules that form a thick gel. Continued cooking and stirring further breaks down the granules, creating a creamy texture. Cooling sets the gel as starch molecules align and form hydrogen bonds.",
      },
      {
        name: "French Onion Soup",
        ingredients: [
          "4 large onions, sliced",
          "4 cups beef stock",
          "2 tbsp flour",
          "2 tbsp butter",
          "French bread, toasted",
          "Gruyere cheese",
        ],
        instructions: [
          "Caramelize onions slowly in butter",
          "Sprinkle flour over onions, stir for 2 minutes",
          "Add hot beef stock gradually, whisking",
          "Simmer 20 minutes",
          "Ladle into bowls, top with bread and cheese",
          "Broil until cheese melts",
        ],
        chemistryExplanation:
          "The flour undergoes gelatinization when combined with the hot stock. Starch granules absorb the liquid and swell, thickening the soup. The whisking ensures even distribution, preventing lumps. The gelatinized starch creates the soup's characteristic body and mouth-feel.",
      },
      {
        name: "Creamy Mashed Potatoes",
        ingredients: [
          "3 lbs russet potatoes",
          "1/2 cup butter",
          "1 cup hot milk",
          "Salt and pepper",
          "Chives for garnish",
        ],
        instructions: [
          "Boil potatoes until fork-tender",
          "Drain and return to pot",
          "Mash while hot",
          "Stir in butter until melted",
          "Gradually add hot milk while stirring",
          "Season and garnish with chives",
        ],
        chemistryExplanation:
          "Potato starch granules gelatinize during boiling, absorbing water and swelling. When mashed while hot, the gelatinized starch releases and creates a creamy texture. Adding hot milk and butter while stirring emulsifies the starch, creating smooth, fluffy mashed potatoes. Overworking releases too much starch, making them gluey.",
      },
    ],
    mains: [
      {
        name: "Classic Béchamel Pasta Bake",
        ingredients: [
          "1 lb pasta",
          "4 tbsp butter",
          "1/4 cup flour",
          "3 cups milk",
          "1 cup gruyere cheese",
          "Nutmeg, salt, pepper",
          "Breadcrumbs",
        ],
        instructions: [
          "Melt butter, whisk in flour, cook for 2 minutes (roux)",
          "Gradually whisk in milk",
          "Simmer, stirring constantly, until thickened (8-10 min)",
          "Add cheese, nutmeg, season to taste",
          "Mix with cooked pasta, transfer to baking dish",
          "Top with breadcrumbs, bake at 375°F for 25 minutes",
        ],
        chemistryExplanation:
          "Béchamel is a textbook example of starch gelatinization for sauce-making. The roux (butter and flour) contains starch granules coated in fat. When hot milk is added, the starch granules absorb the liquid and swell, gelatinizing at around 180°F. The amylose and amylopectin molecules leach out, forming a network that traps water and creates viscosity. The fat from the butter prevents the sauce from becoming gluey by coating the starch molecules and limiting their ability to bond together.",
      },
      {
        name: "Risotto with Mushrooms",
        ingredients: [
          "1.5 cups Arborio rice",
          "6 cups hot chicken stock",
          "1 cup white wine",
          "8 oz mushrooms",
          "1 onion, diced",
          "1/2 cup parmesan",
          "3 tbsp butter",
        ],
        instructions: [
          "Sauté onions and mushrooms in butter",
          "Add rice, toast for 2 minutes",
          "Add wine, stir until absorbed",
          "Add stock one ladle at a time, stirring constantly",
          "Continue until rice is creamy and al dente (20-25 min)",
          "Stir in parmesan and butter",
        ],
        chemistryExplanation:
          "Risotto relies on controlled starch gelatinization. Arborio rice has high amylopectin content. The constant stirring and gradual liquid addition cause the outer starch granules to burst, releasing amylopectin into the cooking liquid. This creates the characteristic creamy, slightly sticky texture. The rice grains remain al dente at the center because the starch there gelatinizes more slowly. The released starch acts as a natural thickener—no cream needed!",
      },
      {
        name: "Classic Gravy with Turkey",
        ingredients: [
          "Turkey drippings",
          "1/4 cup flour",
          "2 cups turkey or chicken stock",
          "Salt and pepper",
          "Fresh herbs",
        ],
        instructions: [
          "Pour turkey drippings into a pan, leaving 1/4 cup fat",
          "Whisk flour into fat over medium heat for 2-3 minutes",
          "Gradually whisk in hot stock",
          "Simmer, stirring constantly, until thickened (5-7 minutes)",
          "Season with salt, pepper, and fresh herbs",
        ],
        chemistryExplanation:
          "Gravy is made through starch gelatinization. The roux (flour cooked in fat) contains starch granules coated in fat. When hot stock is added, the granules absorb liquid and swell at around 180°F. Amylose and amylopectin leach out, creating a network that traps liquid and thickens the gravy. The fat prevents the sauce from becoming gluey by limiting starch bonding.",
      },
    ],
  },
  enzymatic: {
    appetizers: [
      {
        name: "Apple and Walnut Salad",
        ingredients: [
          "2 apples, sliced",
          "Lemon juice",
          "Mixed greens",
          "1/2 cup walnuts, toasted",
          "Blue cheese, crumbled",
          "Balsamic vinaigrette",
        ],
        instructions: [
          "Slice apples and immediately toss with lemon juice",
          "Toast walnuts in a dry pan",
          "Combine greens, apples, walnuts, and blue cheese",
          "Drizzle with vinaigrette",
        ],
        chemistryExplanation:
          "Apples contain the enzyme polyphenol oxidase (PPO), which catalyzes the oxidation of phenolic compounds when cells are damaged (by cutting). This produces brown-colored melanins—the same pigments in our skin. Lemon juice prevents this in two ways: its acidity denatures the PPO enzyme (enzymes are proteins), and ascorbic acid (vitamin C) acts as a reducing agent, preferentially reacting with oxygen before it can oxidize the phenols.",
      },
      {
        name: "Avocado Toast with Lime",
        ingredients: [
          "2 ripe avocados",
          "Juice of 1 lime",
          "4 slices bread, toasted",
          "Red pepper flakes",
          "Sea salt",
          "Cherry tomatoes",
        ],
        instructions: [
          "Mash avocados with lime juice immediately",
          "Toast bread until golden",
          "Spread avocado mixture on toast",
          "Top with halved cherry tomatoes",
          "Sprinkle with salt and red pepper flakes",
        ],
        chemistryExplanation:
          "Avocados also contain polyphenol oxidase that causes enzymatic browning when exposed to oxygen. The lime juice's acidity denatures the enzyme and its vitamin C prevents oxidation, keeping the avocado bright green. This is the same enzymatic process that causes guacamole to turn brown if left exposed to air.",
      },
      {
        name: "Fresh Pear and Arugula Salad",
        ingredients: [
          "2 pears, sliced",
          "Lemon juice",
          "Arugula",
          "Pecans, toasted",
          "Gorgonzola cheese",
          "Honey vinaigrette",
        ],
        instructions: [
          "Slice pears and toss immediately with lemon juice",
          "Toast pecans",
          "Combine arugula, pears, pecans, and gorgonzola",
          "Drizzle with honey vinaigrette",
        ],
        chemistryExplanation:
          "Like apples, pears contain polyphenol oxidase enzymes that cause enzymatic browning. The enzyme catalyzes the oxidation of phenolic compounds in the pear's cells when damaged by cutting. Lemon juice prevents browning through acid denaturation of the enzyme and vitamin C's antioxidant properties.",
      },
    ],
    mains: [
      {
        name: "Pineapple-Marinated Pork Chops",
        ingredients: [
          "4 pork chops",
          "1 cup fresh pineapple juice",
          "2 tbsp soy sauce",
          "1 tbsp honey",
          "Garlic and ginger",
          "Salt and pepper",
        ],
        instructions: [
          "Mix pineapple juice, soy sauce, honey, garlic, and ginger",
          "Marinate pork for 1-2 hours (no longer!)",
          "Remove from marinade, pat dry",
          "Grill or pan-sear 4-5 minutes per side",
          "Let rest before serving",
        ],
        chemistryExplanation:
          "Fresh pineapple contains bromelain, a proteolytic enzyme that breaks down proteins. While enzymatic browning involves oxidation, bromelain demonstrates a different enzymatic process—proteolysis. The enzyme cleaves peptide bonds in the pork's muscle proteins, tenderizing the meat. However, over-marinating can make the meat mushy as too many proteins are broken down. Cooking denatures bromelain, stopping the process. Note: canned pineapple won't work—the canning process denatures the enzymes.",
      },
    ],
  },
  reduction: {
    appetizers: [
      {
        name: "Balsamic Reduction with Caprese",
        ingredients: [
          "1 cup balsamic vinegar",
          "2 tbsp honey",
          "Fresh mozzarella",
          "Ripe tomatoes",
          "Fresh basil",
          "Olive oil",
        ],
        instructions: [
          "Simmer balsamic vinegar and honey in a small pot",
          "Reduce by half until syrupy (about 10-15 minutes)",
          "Let cool to thicken further",
          "Slice tomatoes and mozzarella",
          "Layer with basil, drizzle with oil and reduction",
        ],
        chemistryExplanation:
          "Reduction is a physical and chemical concentration process. As water evaporates from the balsamic vinegar, the concentration of acids, sugars, and flavor compounds increases dramatically. The volume decreases, and the viscosity increases as the sugar concentration rises. Some caramelization also occurs, creating new flavor compounds. The result is an intensely flavored, syrupy sauce where every molecule of taste has been concentrated into less liquid.",
      },
    ],
    mains: [
      {
        name: "Steak with Red Wine Reduction",
        ingredients: [
          "2 ribeye steaks",
          "2 cups red wine",
          "1 cup beef stock",
          "2 shallots, minced",
          "Fresh thyme",
          "2 tbsp cold butter",
          "Salt and pepper",
        ],
        instructions: [
          "Season and sear steaks, set aside to rest",
          "In the same pan, sauté shallots",
          "Add wine and stock, scrape up browned bits",
          "Add thyme and simmer until reduced by 75%",
          "Remove from heat, whisk in cold butter",
          "Season sauce and serve over sliced steak",
        ],
        chemistryExplanation:
          "Pan sauce reduction is chemistry in action. As the wine and stock simmer, water molecules evaporate, concentrating flavors and increasing viscosity. The alcohol in wine evaporates faster than water (due to lower boiling point), leaving behind concentrated fruit and tannin flavors. The fond (browned bits) contains Maillard reaction compounds that dissolve into the sauce. The reduction also concentrates gelatin from the stock, adding body. Finally, mounting with butter creates an emulsion, further thickening the sauce.",
      },
      {
        name: "Braised Short Ribs with Demi-Glace",
        ingredients: [
          "4 lb beef short ribs",
          "2 cups red wine",
          "4 cups beef stock",
          "2 carrots, 2 onions, 2 celery stalks",
          "Tomato paste",
          "Fresh herbs",
        ],
        instructions: [
          "Sear short ribs on all sides",
          "Sauté vegetables, add tomato paste",
          "Deglaze with wine, add stock and herbs",
          "Cover and braise at 300°F for 3 hours",
          "Remove ribs, strain liquid",
          "Reduce strained liquid by half until thick and glossy",
          "Serve ribs with sauce",
        ],
        chemistryExplanation:
          "This demonstrates extreme reduction. The braising liquid extracts gelatin (denatured collagen), proteins, and minerals from the meat and bones. During the second reduction, water evaporates while gelatin and other large molecules remain, creating a concentrated, viscous sauce. As the liquid reduces from 6 cups to 1-2 cups, flavor compounds become 3-6 times more concentrated. The gelatin gives the sauce a glossy, coating texture—the signature of a proper demi-glace.",
      },
    ],
  },
};

export default function ChemistryRecipesPage() {
  const [selectedReaction, setSelectedReaction] = useState<ChemicalReaction | null>(null);
  const [generatedMeal, setGeneratedMeal] = useState<MealPlan | null>(null);

  const generateMeal = () => {
    if (!selectedReaction) return;

    const recipes = RECIPE_DATABASE[selectedReaction.id];
    const randomAppetizer = recipes.appetizers[Math.floor(Math.random() * recipes.appetizers.length)];
    const randomMain = recipes.mains[Math.floor(Math.random() * recipes.mains.length)];

    setGeneratedMeal({
      reaction: selectedReaction,
      appetizer: randomAppetizer,
      mainDish: randomMain,
    });
  };

  const reset = () => {
    setSelectedReaction(null);
    setGeneratedMeal(null);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/brian"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Brian&apos;s Section
        </Link>
        <h1 className="text-4xl font-bold text-white mb-2">Chemistry Recipes</h1>
        <p className="text-gray-400">Explore the science behind cooking. Select a chemical reaction to discover recipes!</p>
      </div>

      {!generatedMeal ? (
        <>
          {/* Reaction Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Select a Culinary Chemical Reaction</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {REACTIONS.map((reaction) => (
                <button
                  key={reaction.id}
                  onClick={() => setSelectedReaction(reaction)}
                  className={`p-6 rounded-xl transition-all duration-300 text-left ${
                    selectedReaction?.id === reaction.id
                      ? `bg-gradient-to-br ${reaction.color} ring-2 ring-white`
                      : "glass glass-hover"
                  }`}
                >
                  <div className="text-4xl mb-3">{reaction.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{reaction.name}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{reaction.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          {selectedReaction && (
            <div className="flex justify-center">
              <button
                onClick={generateMeal}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🧪 Create Meal
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Generated Meal Display */}
          <div className="space-y-8">
            {/* Header */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-2 border-indigo-500/30">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-5xl">{generatedMeal.reaction.icon}</span>
                <div>
                  <h2 className="text-3xl font-bold text-white">{generatedMeal.reaction.name}</h2>
                  <p className="text-gray-300 mt-1">{generatedMeal.reaction.description}</p>
                </div>
              </div>
            </div>

            {/* Appetizer */}
            <div className="glass p-8 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🥗</span>
                <h3 className="text-2xl font-bold text-white">Appetizer</h3>
              </div>
              <h4 className="text-xl font-semibold text-indigo-400 mb-4">{generatedMeal.appetizer.name}</h4>

              <div className="mb-6">
                <h5 className="text-lg font-semibold text-white mb-2">Ingredients</h5>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {generatedMeal.appetizer.ingredients.map((ingredient, idx) => (
                    <li key={idx}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h5 className="text-lg font-semibold text-white mb-2">Instructions</h5>
                <ol className="list-decimal list-inside text-gray-300 space-y-2">
                  {generatedMeal.appetizer.instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🔬</span>
                  <h5 className="text-lg font-semibold text-blue-400">The Chemistry</h5>
                </div>
                <p className="text-gray-300 leading-relaxed">{generatedMeal.appetizer.chemistryExplanation}</p>
              </div>
            </div>

            {/* Main Dish */}
            <div className="glass p-8 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🍽️</span>
                <h3 className="text-2xl font-bold text-white">Main Dish</h3>
              </div>
              <h4 className="text-xl font-semibold text-indigo-400 mb-4">{generatedMeal.mainDish.name}</h4>

              <div className="mb-6">
                <h5 className="text-lg font-semibold text-white mb-2">Ingredients</h5>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {generatedMeal.mainDish.ingredients.map((ingredient, idx) => (
                    <li key={idx}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h5 className="text-lg font-semibold text-white mb-2">Instructions</h5>
                <ol className="list-decimal list-inside text-gray-300 space-y-2">
                  {generatedMeal.mainDish.instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🔬</span>
                  <h5 className="text-lg font-semibold text-blue-400">The Chemistry</h5>
                </div>
                <p className="text-gray-300 leading-relaxed">{generatedMeal.mainDish.chemistryExplanation}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={generateMeal}
                className="px-6 py-3 rounded-lg glass glass-hover text-white font-medium transition-all"
              >
                Generate Different Meal
              </button>
              <button
                onClick={reset}
                className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all"
              >
                Choose Different Reaction
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
