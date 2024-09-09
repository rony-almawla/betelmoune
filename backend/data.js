import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Workshop from './models/workshopModel.js';
const workshops = [
  {
    id: 1,
    name: 'Introduction to El Moune',
    slug: 'introduction-to-el-moune',
    description:
      'Learn the basics of traditional Lebanese food preservation techniques.',
    content: [
      'Step 1: Introduction to El Moune - Understand the significance of food preservation in Lebanese culture.',
      'Step 2: History of El Moune - Explore the historical background and cultural importance of El Moune.',
      'Step 3: Overview of Techniques - Get familiar with the various traditional preservation methods such as drying, pickling, and fermenting.',
      'Step 4: Tools and Ingredients - Learn about the essential tools and ingredients needed for food preservation.',
      'Step 5: Preparing the Workspace - Set up your kitchen for the preservation process, ensuring cleanliness and organization.',
      'Step 6: Initial Hands-on Experience - Engage in a simple preservation task under guidance, such as drying herbs or making a small batch of pickles.',
      'Step 7: Q&A and Troubleshooting - Address common challenges and questions that arise during the preservation process.',
    ],
    date: new Date('2024-08-01T10:00:00Z'),
    duration: 3,
    capacity: 20,
    registeredUsers: [],
    instructor: '66a15aa2e0f69ffdcda06125',
    topics: ['Introduction', 'History of El Moune'],
    price: 50,
    images: [
      'https://zaatarandzaytoun.com/wp-content/uploads/2020/06/makdous-18.jpg',
      'https://silkroadrecipes.com/wp-content/uploads/2020/07/Lebanese-Seven-Spice-Blend-square.jpg',
      'https://miro.medium.com/v2/resize:fit:1080/1*qlBeWAKsZNZjNmCy4cloWw.png',
      'https://www.four-seasons.ro/images/evenimente/spices-four-seasons2.png',
      'https://www.allrecipes.com/thmb/MU4sihJ6xm5ATweejVWzamdbJxo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/267408-spicy-vietnamese-quick-pickled-vegetables-DDMFS-4x3-2719-becd9a3a80ce497a81f66ef8912dfae1.jpg',
      'https://www.cooking-therapy.com/wp-content/uploads/2020/08/Pickled-Vegetables-5.jpg',
    ],
    type: 'Trending',
  },
  {
    id: 2,
    name: 'Pickling Vegetables',
    slug: 'pickling-vegetables',
    description:
      'Master the art of pickling various vegetables in the traditional Lebanese style.',
    content: [
      'Step 1: Introduction to Pickling - Learn the basics of pickling and the benefits of preserving vegetables.',
      'Step 2: Choosing Vegetables - Select the best vegetables for pickling, considering texture and flavor.',
      'Step 3: Preparing the Vegetables - Clean, peel, and cut the vegetables to the appropriate size for pickling.',
      'Step 4: Preparing the Brine - Mix the right combination of vinegar, water, and spices to create a flavorful brine.',
      'Step 5: Sterilizing the Jars - Ensure the jars are clean and sterile to prevent contamination.',
      'Step 6: Packing the Jars - Carefully pack the vegetables into the jars, ensuring even distribution of brine and spices.',
      'Step 7: Sealing and Storing - Properly seal the jars and store them in a cool, dark place for optimal preservation.',
      'Step 8: Tasting and Adjusting - After a few days or weeks, taste the pickles and adjust seasoning if necessary.',
      'Step 9: Serving and Enjoying - Learn creative ways to incorporate pickled vegetables into Lebanese dishes.',
    ],
    date: new Date('2024-08-05T14:00:00Z'),
    duration: 2,
    capacity: 15,
    registeredUsers: [],
    instructor: '66a15aa2e0f69ffdcda06125',
    topics: ['Pickling', 'Vegetables'],
    price: 40,
    type: 'Trending',
    images: [
      'https://www.allrecipes.com/thmb/MU4sihJ6xm5ATweejVWzamdbJxo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/267408-spicy-vietnamese-quick-pickled-vegetables-DDMFS-4x3-2719-becd9a3a80ce497a81f66ef8912dfae1.jpg',
      'https://www.cooking-therapy.com/wp-content/uploads/2020/08/Pickled-Vegetables-5.jpg',
      'https://foodhub.scene7.com/is/image/woolworthsltdprod/2203-pickled-vegetables:Mobile-1300x1150',
      'https://www.seriouseats.com/thmb/uQeEIawswJk3hopfN3pWBYGlZac=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20230314-SEA-Tourshi-VickyWasik-hero-b897b4ac0afb459fa5e95b67549d1997.JPG',
    ],
  },
  {
    id: 3,
    name: 'Making Labneh at Home',
    slug: 'making-labneh-at-home',
    description:
      'Learn how to make your own labneh, a traditional Lebanese yogurt cheese.',
    content: [
      'Step 1: Introduction to Labneh - Understand the origins and cultural significance of labneh in Lebanese cuisine.',
      'Step 2: Selecting the Yogurt - Choose the right type of yogurt for making labneh, considering fat content and flavor.',
      'Step 3: Straining the Yogurt - Learn the process of straining yogurt using cheesecloth to achieve the perfect consistency.',
      'Step 4: Adding Flavors - Experiment with adding herbs, spices, or garlic to enhance the flavor of your labneh.',
      'Step 5: Shaping and Storing - Shape the labneh into balls or leave it as a spread, and learn proper storage techniques.',
      'Step 6: Serving Suggestions - Discover traditional and modern ways to serve labneh, such as with olive oil and za’atar.',
      'Step 7: Troubleshooting - Address common issues such as over-straining or sourness, and learn how to correct them.',
    ],
    date: new Date('2024-08-10T09:00:00Z'),
    duration: 4,
    capacity: 25,
    registeredUsers: [],
    instructor: '66a15aa2e0f69ffdcda06125',
    topics: ['Labneh', 'Dairy Products'],
    price: 60,
    type: 'Trending',
    images: [
      'https://hadiaslebanesecuisine.com/newsite/wp-content/uploads/2014/02/labneh-balls-2000-1-2-280x300.jpg',
      'https://littlesunnykitchen.com/wp-content/uploads/2021/03/Labneh-Recipe-1-750x750.jpg',
      'https://cdn.loveandlemons.com/wp-content/uploads/2020/05/labneh-yogurt.jpg',
      'https://www.manusmenu.com/wp-content/uploads/2012/06/1-Labneh-1-1-of-1.jpg',
    ],
  },
  {
    id: 4,
    name: 'Preserving Fruits',
    slug: 'preserving-fruits',
    description: 'Techniques for preserving fruits using traditional Lebanese methods.',
    date: new Date('2024-08-15T11:00:00Z'),
    duration: 3,
    capacity: 20,
    registeredUsers: [],
    instructor: '66a15aa2e0f69ffdcda06125',
    topics: ['Fruit Preservation', 'Jam Making'],
    price: 50,
    type: 'Premium',
    images: [
      'https://blog.thompson-morgan.com/wp-content/uploads/2022/07/20220607_tm_overview_of_preserved_fruits.jpg',
      'https://i0.wp.com/zoominnutrition.com/wp-content/uploads/2021/10/Food_Preserving_cov1.png?resize=940%2C675&ssl=1',
      'https://www.almanac.com/sites/default/files/users/The%20Editors/frozen-shutterstock_1580573581_0_full_width.jpg',
      'https://www.halfyourplate.ca/wp-content/uploads/2022/09/strawberry-freezer-jam-in-jar-sq.jpg',
    ],
    content: [
      "Step 1: Introduction to fruit preservation, covering various traditional Lebanese methods and the science behind them.",
      "Step 2: Selecting the right fruits for preservation, focusing on seasonal availability and quality indicators.",
      "Step 3: Preparing fruits for preservation, including washing, peeling, and cutting techniques.",
      "Step 4: Exploring different preservation techniques such as drying, sugaring, and making fruit preserves.",
      "Step 5: Demonstrating the process of making homemade jams and jellies, including proper sterilization methods.",
      "Step 6: Learning how to store preserved fruits to maximize shelf life, with tips on avoiding common pitfalls.",
      "Step 7: Hands-on activity where participants will create their own preserved fruit jars to take home.",
      "Step 8: Final Q&A and troubleshooting session, covering any additional questions participants may have."
    ]
  },
  {
    id: 5,
    name: 'Olive Preservation',
    slug: 'olive-preservation',
    description: 'Learn how to preserve olives in the traditional Lebanese way.',
    date: new Date('2024-08-20T10:00:00Z'),
    duration: 3,
    capacity: 20,
    registeredUsers: [],
    instructor: '66a15aa2e0f69ffdcda06125',
    topics: ['Olive Preservation', 'Salting Techniques'],
    price: 50,
    type: 'Premium',
    images: [
      'https://cdn.mos.cms.futurecdn.net/7X5dvNX9hpgZFvwSGaXZpi.jpg',
      'https://www.thespruceeats.com/thmb/JX-Ik1jghLnbGAknB7eNlP_8KVo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/greenolives-5a85e5dfa18d9e0037a56ce5.jpg',
      'https://i.ytimg.com/vi/S7PLpITU-RA/maxresdefault.jpg',
      'https://koala.sh/api/image/v2-9eq9g-r8e1m.jpg?width=1216&height=832&dream',
    ],
    content: [
      "Step 1: Introduction to olive preservation, focusing on traditional Lebanese methods and their historical significance.",
      "Step 2: Selection and preparation of olives, including how to choose the right varieties and proper washing techniques.",
      "Step 3: Demonstration of brining methods, covering the salting process and various brine recipes.",
      "Step 4: Hands-on activity in preparing olives for brining, with participants making their own brine mixtures.",
      "Step 5: Learning about the curing process, including how to monitor and adjust salinity levels over time.",
      "Step 6: Exploring different flavoring techniques, such as adding herbs, spices, or citrus to the brine.",
      "Step 7: Packaging and storing olives for long-term preservation, with tips on maintaining flavor and texture.",
      "Step 8: Final tasting session where participants can sample the preserved olives and compare different methods."
    ]
  },
  {
    id: 6,
    name: 'Making Kibbeh Nayeh',
    slug: 'making-kibbeh-nayeh',
    description: 'A workshop dedicated to making Kibbeh Nayeh, a traditional Lebanese raw meat dish.',
    date: new Date('2024-08-25T09:00:00Z'),
    duration: 4,
    capacity: 25,
    registeredUsers: [],
    instructor: '66a15aa2e0f69ffdcda06125',
    topics: ['Kibbeh Nayeh', 'Meat Preparation'],
    price: 60,
    type: 'Upcoming',
    images: [
      'https://www.mamaslebanesekitchen.com/wp-content/uploads/2011/09/Kibbeh-Nayyeh.jpg',
      'https://www.mamaslebanesekitchen.com/wp-content/uploads/2011/09/kibbeh3.jpg',
      'https://thematbakh.com/wp-content/uploads/2022/04/kibbeh-nayeh-lebanese-raw-kibbeh-3.jpg',
      'https://thematbakh.com/wp-content/uploads/2022/04/kibbeh-nayeh-lebanese-raw-kibbeh-7.jpg',
    ],
    content: [
      "Step 1: Introduction to Kibbeh Nayeh, covering its cultural significance and the traditional ingredients used.",
      "Step 2: Selecting and preparing the right cut of meat, focusing on the importance of freshness and texture.",
      "Step 3: Demonstrating the process of grinding meat to achieve the perfect consistency for Kibbeh Nayeh.",
      "Step 4: Preparing the bulgur wheat, including soaking and seasoning to enhance the dish's flavor.",
      "Step 5: Mixing the meat and bulgur to create the Kibbeh Nayeh mixture, with tips on achieving the ideal texture.",
      "Step 6: Shaping and presenting Kibbeh Nayeh, including traditional plating techniques and garnishing options.",
      "Step 7: Hands-on activity where participants create their own Kibbeh Nayeh dishes, with personalized seasoning.",
      "Step 8: Final tasting session, where participants can enjoy their creations and receive feedback from the instructor."
    ]
  },
  {
    id: 7,
    name: 'Canning Tomatoes',
    slug: 'canning-tomatoes',
    description: 'Learn how to can tomatoes to use in various Lebanese dishes.',
    date: new Date('2024-08-30T11:00:00Z'),
    duration: 3,
    capacity: 20,
    registeredUsers: [],
    instructor: '66a15aa2e0f69ffdcda06125',
    topics: ['Tomato Canning', 'Sauce Making'],
    price: 50,
    type: 'Premium',
    images: [
      'https://www.shelovesbiscotti.com/wp-content/uploads/2017/09/IMG_0494.png',
      'https://images.squarespace-cdn.com/content/v1/563cf214e4b021af1b575f8a/1454031226999-JCBCSGWASXSI5DZYMLFK/tomato-canning.jpg',
      'https://thecozycook.com/wp-content/uploads/2015/08/Canned-Tomatoes.jpg',
      'https://melissaknorris.com/wp-content/uploads/2021/09/tomatosaucelineup.jpg',
    ],
    content: [
      "Step 1: Introduction to the basics of canning tomatoes, including safety guidelines and equipment needed.",
      "Step 2: Selection of tomatoes, focusing on choosing the right varieties for canning.",
      "Step 3: Preparing the tomatoes by blanching, peeling, and cutting them to size.",
      "Step 4: Demonstrating the process of making tomato sauce or whole canned tomatoes.",
      "Step 5: Sterilizing jars and lids to ensure a safe and long-lasting preservation.",
      "Step 6: Filling and sealing the jars, with tips on avoiding air bubbles and ensuring a proper seal.",
      "Step 7: Processing the jars using a water bath canning method to achieve the right preservation.",
      "Step 8: Final inspection of the canned tomatoes, storage tips, and a Q&A session to address any concerns."
    ]
  },
  {
    id: 8,
    name: 'Herb Drying Techniques',
    slug: 'herb-drying-techniques',
    description: 'Preserve herbs using traditional Lebanese drying techniques.',
    date: new Date('2024-09-05T14:00:00Z'),
    duration: 2,
    capacity: 15,
    registeredUsers: [],
    instructor: '66a15aa2e0f69ffdcda06125',
    topics: ['Herb Drying', 'Spices'],
    price: 40,
    type: 'Premium',
    images: [
      'https://morningchores.com/wp-content/uploads/2020/09/Drying-Herbs.jpg',
      'https://www.tasteofhome.com/wp-content/uploads/2024/02/GettyImages-1923062478-how-to-dry-herbs-JVedit.jpg',
      'https://images.saymedia-content.com/.image/ar_4:3%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:eco%2Cw_1200/MTc0MTE1Njc4MjUxNzg3NzIx/drying-herbs-in-a-convection-oven-dehydrating-dehydrator-dry-herb-oregano.jpg',
      'https://afarmgirlinthemaking.com/wp-content/uploads/2020/07/PSX_20200703_165219-scaled-e1593830501103.jpg',
    ],
    content: [
      "Step 1: Introduction to herb drying, focusing on the traditional methods used in Lebanon.",
      "Step 2: Selection and preparation of herbs, including washing and grouping techniques.",
      "Step 3: Demonstrating different drying methods, such as air drying, oven drying, and using a dehydrator.",
      "Step 4: Hands-on activity where participants prepare herbs for drying using the chosen method.",
      "Step 5: Tips on how to maintain the flavor and color of dried herbs during the drying process.",
      "Step 6: Storing dried herbs properly to extend their shelf life and preserve their potency.",
      "Step 7: Creative uses of dried herbs in Lebanese cuisine, including making herb blends and teas.",
      "Step 8: Final discussion on the benefits of drying herbs at home, along with a Q&A session."
    ]
  },
  {
    id: 9,
    name: 'Making Pomegranate Molasses',
    slug: 'making-pomegranate-molasses',
    description: 'A step-by-step workshop on making pomegranate molasses at home.',
    date: new Date('2024-09-10T10:00:00Z'),
    duration: 3,
    capacity: 20,
    registeredUsers: [],
    instructor: '66a15aa2e0f69ffdcda06125',
    topics: ['Pomegranate Molasses', 'Preservation Techniques'],
    price: 50,
    type: 'Premium',
    images: [
      'https://cdn.prod.website-files.com/61cb78816c8c4a56f75f0656/62699c14bab0293d0abd9406_hero.jpg',
      'https://img.taste.com.au/1BB6Goao/taste/2016/11/how-to-make-pomegranate-molasses-64412-1.jpg',
      'https://www.seriouseats.com/thmb/cjbTwfG6hubSiNc2KrRe41eVH-E=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__2021__02__20210201-pomegranate-molasses-nik-sharma-6-ecf9af54466a4334a7123e1c95dd510e.jpg',
      'https://assets.bonappetit.com/photos/57acf3ab1b33404414975383/1:1/w_2560%2Cc_limit/pomegranate-molasses-chicken-with-bulgur-salad.jpg',
    ],
    content: [
      "Step 1: Introduction to pomegranate molasses, including its uses in Lebanese cuisine and the benefits of making it at home.",
      "Step 2: Selection of pomegranates, focusing on choosing the best varieties for juice extraction.",
      "Step 3: Demonstrating the process of extracting pomegranate juice, including techniques for maximizing yield.",
      "Step 4: Cooking the pomegranate juice to reduce it into molasses, with tips on achieving the perfect consistency.",
      "Step 5: Flavoring the molasses with optional ingredients like sugar and lemon juice.",
      "Step 6: Proper storage techniques to preserve the quality and longevity of the molasses.",
      "Step 7: Hands-on activity where participants create their own batch of pomegranate molasses.",
      "Step 8: Tasting session and discussion on the different ways to incorporate pomegranate molasses into recipes."
    ]
  },
  {
    id: 10,
    name: 'Traditional Lebanese Spices',
    slug: 'traditional-lebanese-spices',
    description: 'Learn about the traditional Lebanese spices and how to preserve them.',
    date: new Date('2024-09-15T14:00:00Z'),
    duration: 2,
    capacity: 15,
    registeredUsers: [],
    instructor: '66a15aa2e0f69ffdcda06125',
    topics: ['Spices', 'Preservation Techniques'],
    price: 40,
    type: 'Premium',
    images: [
      'https://silkroadrecipes.com/wp-content/uploads/2020/07/Lebanese-Seven-Spice-Blend-square.jpg',
      'https://miro.medium.com/v2/resize:fit:1080/1*qlBeWAKsZNZjNmCy4cloWw.png',
      'https://www.four-seasons.ro/images/evenimente/spices-four-seasons2.png',
      'https://forksandfoliage.com/wp-content/uploads/2023/05/lebanese-7-spice-21.jpg',
    ],
    content: [
      "Step 1: Introduction to traditional Lebanese spices, covering their historical significance and common uses.",
      "Step 2: Exploring the different spices commonly used in Lebanese cuisine, including their flavors and aromas.",
      "Step 3: Demonstrating the process of grinding and mixing spices to create traditional Lebanese blends.",
      "Step 4: Hands-on activity where participants create their own spice blends using traditional recipes.",
      "Step 5: Learning about the preservation techniques for spices, including proper storage to maintain freshness.",
      "Step 6: Exploring the health benefits of various spices and how they can be incorporated into daily meals.",
      "Step 7: Creative uses of spices in Lebanese dishes, with demonstrations on how to enhance flavor profiles.",
      "Step 8: Final tasting session where participants sample dishes seasoned with the spices they've created."
    ]
  },
  {
    id: 11,
    name: 'Making Makdous',
    slug: 'making-makdous',
    description: 'A comprehensive guide to making Makdous, stuffed pickled eggplants.',
    date: new Date('2024-09-20T09:00:00Z'),
    duration: 4,
    capacity: 25,
    registeredUsers: [],
    instructor: '66a15aa2e0f69ffdcda06125',
    topics: ['Makdous', 'Pickling', 'Stuffed Vegetables'],
    price: 0,
    type: 'Free',
    images: [
      'https://falasteenifoodie.com/wp-content/uploads/2023/02/makdous.jpg',
      'https://zaatarandzaytoun.com/wp-content/uploads/2020/06/makdous-9-1024x679.jpg',
      'https://hadiaslebanesecuisine.com/newsite/wp-content/uploads/2023/07/makdous-14-2.jpg',
      'https://www.alphafoodie.com/wp-content/uploads/2020/04/Simple-Stuffed-Makdous-Recipe-7-of-9.jpeg',
    ],
    content: [
      "Step 1: Introduction to Makdous, including its historical and cultural significance in Lebanese cuisine.",
      "Step 2: Selection and preparation of eggplants, including washing, trimming, and salting to remove excess moisture.",
      "Step 3: Preparing the stuffing mixture with ingredients like walnuts, garlic, red pepper, and spices.",
      "Step 4: Demonstrating the process of stuffing the eggplants with the prepared mixture.",
      "Step 5: Discussing the pickling brine ingredients and preparing the brine mixture for preserving the stuffed eggplants.",
      "Step 6: Packing the stuffed eggplants into jars, ensuring proper layering and sealing techniques.",
      "Step 7: Final steps in the pickling process, including storing the jars and monitoring fermentation.",
      "Step 8: Tasting session and discussion on how to use Makdous in various Lebanese dishes and recipes."
    ]
  },
  {
    id: 12,
    name: 'Making Quince Jam',
    slug: 'making-quince-jam',
    description: 'Learn how to make quince jam, a traditional Lebanese preserve.',
    date: new Date('2024-09-25T10:00:00Z'),
    duration: 3,
    capacity: 20,
    registeredUsers: [],
    instructor: '66a15aa2e0f69ffdcda06125',
    topics: ['Quince Jam', 'Fruit Preservation'],
    price: 50,
    type: 'Upcoming',
    images: [
      'https://hildaskitchenblog.com/wp-content/uploads/2017/10/quince-preserves-8-500x500.jpg',
      'https://www.lazzaris.com/wp-content/uploads/sites/2/2018/07/Marmellata_mele_cotogne3.jpg',
      'https://hadiaslebanesecuisine.com/newsite/wp-content/uploads/2017/11/safarjal-1.jpg',
      'https://edibleparadise.com/wp-content/uploads/2023/09/AdobeStock_524247279_quince-jam.jpg',
    ],
    content: [
      "Step 1: Introduction to quince and its role in Lebanese cuisine, including an overview of the jam-making process.",
      "Step 2: Selecting and preparing quinces, including peeling, coring, and chopping to prepare them for cooking.",
      "Step 3: Cooking the quinces with sugar, lemon juice, and any additional flavorings to create the jam base.",
      "Step 4: Demonstrating how to test the jam for the correct consistency using techniques like the cold plate test.",
      "Step 5: Sterilizing jars and lids to ensure they are ready for preserving the jam.",
      "Step 6: Filling and sealing the jars with hot quince jam, ensuring proper packing to avoid air bubbles.",
      "Step 7: Discussing proper storage techniques for quince jam to maintain its quality and shelf life.",
      "Step 8: Tasting session and discussion on different ways to use quince jam in recipes and how it complements Lebanese dishes."
    ]
  },
];

dotenv.config();

console.log('url::', process.env.MONGO_ATLAS);

mongoose
  .connect(process.env.MONGO_ATLAS)
  .then(() => console.log('connected to db!'))
  .catch((err) => {
    console.log(err.message);
  });

const addWorkshops = async () => {
  // await Workshop.deleteMany({});
  await Workshop.deleteMany({});
  const createdWorkshops = await Workshop.insertMany(workshops);
};

addWorkshops();
