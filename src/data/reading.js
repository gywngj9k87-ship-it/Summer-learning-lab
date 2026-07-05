// Reading comprehension: a short passage plus questions about it.
// Ordered roughly easy -> hard within each level so the adaptive engine can
// pick easier or harder passages based on recent performance.
export const reading = {
  junior: [
    {
      id: 'read-j1',
      title: 'The Little Cat',
      passage:
        'Milo is a small grey cat. He likes to sleep in the sun. Every morning Milo drinks his milk and then plays with a red ball. At night, Milo sleeps on a soft bed.',
      questions: [
        { q: 'What colour is Milo?', choices: ['Grey', 'Red', 'White', 'Black'], answer: 0 },
        { q: 'What does Milo play with?', choices: ['A bone', 'A red ball', 'A box', 'A hat'], answer: 1 },
        { q: 'Where does Milo sleep at night?', choices: ['In the sun', 'On a soft bed', 'In a tree', 'In the milk'], answer: 1 },
      ],
    },
    {
      id: 'read-j2',
      title: 'A Rainy Day',
      passage:
        'It was raining outside. Ana put on her yellow boots and a warm coat. She jumped in the puddles and laughed. When the rain stopped, a big rainbow filled the sky.',
      questions: [
        { q: 'What colour were Ana’s boots?', choices: ['Blue', 'Green', 'Yellow', 'Pink'], answer: 2 },
        { q: 'What did Ana jump in?', choices: ['Leaves', 'Puddles', 'Sand', 'Snow'], answer: 1 },
        { q: 'What did Ana see when the rain stopped?', choices: ['A rainbow', 'A star', 'A plane', 'The moon'], answer: 0 },
      ],
    },
    {
      id: 'read-j3',
      title: 'The Garden',
      passage:
        'Tom and his mom planted seeds in the garden. They gave the seeds water every day. After many days, small green plants grew. Soon there were bright red tomatoes to eat.',
      questions: [
        { q: 'What did Tom and his mom plant?', choices: ['Trees', 'Seeds', 'Flowers only', 'Rocks'], answer: 1 },
        { q: 'What did they give the seeds every day?', choices: ['Milk', 'Water', 'Juice', 'Sand'], answer: 1 },
        { q: 'What grew in the end?', choices: ['Apples', 'Red tomatoes', 'Corn', 'Beans'], answer: 1 },
      ],
    },
    {
      id: 'read-j4',
      title: 'At the Beach',
      passage:
        'Sara went to the beach with her family. She built a big sandcastle and looked for shells. The waves were cool on her feet. She found a pink shell and kept it as a treasure.',
      questions: [
        { q: 'What did Sara build?', choices: ['A sandcastle', 'A snowman', 'A treehouse', 'A boat'], answer: 0 },
        { q: 'What did Sara find?', choices: ['A crab', 'A pink shell', 'A fish', 'A coin'], answer: 1 },
        { q: 'How did the waves feel on her feet?', choices: ['Hot', 'Cool', 'Dry', 'Sticky'], answer: 1 },
      ],
    },
    {
      id: 'read-j5',
      title: 'The Busy Ant',
      passage:
        'A little ant found a big crumb of bread. It was too heavy to carry alone. So the ant called her friends. Together, all the ants carried the crumb back to their nest under the ground.',
      questions: [
        { q: 'What did the ant find?', choices: ['A crumb of bread', 'A leaf', 'A stone', 'A worm'], answer: 0 },
        { q: 'Why did the ant call her friends?', choices: ['To play', 'The crumb was too heavy alone', 'To sleep', 'To sing'], answer: 1 },
        { q: 'Where did the ants take the crumb?', choices: ['To their nest', 'To a tree', 'To the river', 'To a house'], answer: 0 },
      ],
    },
    {
      id: 'read-j6',
      title: 'Ben’s New Bike',
      passage:
        'Ben got a shiny blue bike for his birthday. At first he was a little scared. His dad held the bike as Ben pushed the pedals. After a few tries, Ben could ride all by himself. He felt very proud.',
      questions: [
        { q: 'What colour was Ben’s bike?', choices: ['Red', 'Blue', 'Green', 'Black'], answer: 1 },
        { q: 'How did Ben feel at first?', choices: ['A little scared', 'Angry', 'Sleepy', 'Hungry'], answer: 0 },
        { q: 'Who helped Ben?', choices: ['His dad', 'His teacher', 'His dog', 'His friend'], answer: 0 },
        { q: 'How did Ben feel at the end?', choices: ['Proud', 'Sad', 'Bored', 'Cross'], answer: 0 },
      ],
    },
    {
      id: 'read-j7',
      title: 'The Moon at Night',
      passage:
        'When the sun goes down, the sky gets dark. The moon comes out and gives a soft light. Sometimes the moon looks round like a ball, and sometimes it looks like a thin banana. Stars twinkle around it.',
      questions: [
        { q: 'When does the moon come out?', choices: ['When the sun goes down', 'At lunchtime', 'In the morning', 'During rain'], answer: 0 },
        { q: 'What can the moon look like sometimes?', choices: ['A thin banana', 'A square', 'A car', 'A tree'], answer: 0 },
        { q: 'What twinkles around the moon?', choices: ['Stars', 'Fish', 'Leaves', 'Cars'], answer: 0 },
      ],
    },
    {
      id: 'read-j8',
      title: 'Lily Helps Out',
      passage:
        'Lily saw that the kitchen was messy. Toys were on the floor and cups were on the table. Without being asked, Lily put the toys in the box and the cups in the sink. When her mom came in, she gave Lily a big hug and said thank you.',
      questions: [
        { q: 'What was messy?', choices: ['The kitchen', 'The garden', 'The car', 'The park'], answer: 0 },
        { q: 'Where did Lily put the toys?', choices: ['In the box', 'On the table', 'In the sink', 'Outside'], answer: 0 },
        { q: 'Did someone ask Lily to help?', choices: ['No, she chose to', 'Yes, her mom', 'Yes, her dad', 'Yes, her friend'], answer: 0 },
        { q: 'How did her mom react?', choices: ['Gave her a hug', 'Was angry', 'Said nothing', 'Went away'], answer: 0 },
      ],
    },
  ],
  senior: [
    {
      id: 'read-s1',
      title: 'The Honeybee',
      passage:
        'Honeybees are important helpers in nature. As they fly from flower to flower collecting nectar, they carry pollen with them. This pollen helps plants make seeds and fruit — a process called pollination. Without bees, many of the foods we enjoy, like apples and almonds, would be much harder to grow. A single hive can hold tens of thousands of bees, all working together for the colony.',
      questions: [
        { q: 'What do bees carry from flower to flower?', choices: ['Water', 'Pollen', 'Sugar', 'Sand'], answer: 1 },
        { q: 'What is the process described in the passage called?', choices: ['Digestion', 'Evaporation', 'Pollination', 'Migration'], answer: 2 },
        { q: 'According to the passage, why are bees important to us?', choices: ['They make noise', 'They help grow foods we eat', 'They are colourful', 'They live in trees'], answer: 1 },
        { q: 'About how many bees can a single hive hold?', choices: ['A few dozen', 'A few hundred', 'Tens of thousands', 'Millions'], answer: 2 },
      ],
    },
    {
      id: 'read-s2',
      title: 'The Great Library',
      passage:
        'Long ago, the city of Alexandria in Egypt was home to one of the greatest libraries in the ancient world. Scholars travelled from far-off lands to read its scrolls and share ideas about science, mathematics, and the stars. The library aimed to collect a copy of every book known at the time. Although it was eventually lost, its spirit of curiosity still inspires learners today.',
      questions: [
        { q: 'Where was this great library located?', choices: ['Rome', 'Athens', 'Alexandria', 'Cairo'], answer: 2 },
        { q: 'Why did scholars travel there?', choices: ['To trade gold', 'To read scrolls and share ideas', 'To build ships', 'To watch games'], answer: 1 },
        { q: 'What was the library’s goal?', choices: ['To collect every known book', 'To hide books', 'To sell scrolls', 'To teach sailing'], answer: 0 },
        { q: 'What still inspires learners today, according to the passage?', choices: ['Its gold', 'Its spirit of curiosity', 'Its walls', 'Its location'], answer: 1 },
      ],
    },
    {
      id: 'read-s3',
      title: 'Rivers of Ice',
      passage:
        'Glaciers are enormous rivers of ice that move slowly over land, sometimes only a few centimetres each day. Formed from snow that piles up and presses together over many years, glaciers store much of the planet’s fresh water. As they slide downhill, they carve valleys and shape mountains. Scientists study glaciers closely because changes in their size can tell us a great deal about the Earth’s climate.',
      questions: [
        { q: 'What are glaciers made of?', choices: ['Rock', 'Ice', 'Sand', 'Mud'], answer: 1 },
        { q: 'How fast do glaciers usually move?', choices: ['Very fast', 'A few centimetres a day', 'They never move', 'Faster than a river'], answer: 1 },
        { q: 'What do glaciers store a lot of?', choices: ['Salt water', 'Fresh water', 'Oil', 'Gas'], answer: 1 },
        { q: 'Why do scientists study glaciers?', choices: ['For fishing', 'They reveal clues about the climate', 'To find gold', 'To build roads'], answer: 1 },
      ],
    },
    {
      id: 'read-s4',
      title: 'The Marathon',
      passage:
        'The marathon race is named after a town in ancient Greece. According to legend, a messenger ran about 40 kilometres from the town of Marathon to Athens to announce a victory in battle. Today, marathon runners cover a similar distance of 42.2 kilometres. Training for a marathon takes months of practice, discipline, and careful attention to rest and nutrition.',
      questions: [
        { q: 'The marathon is named after a town in which country?', choices: ['Italy', 'Greece', 'Egypt', 'Spain'], answer: 1 },
        { q: 'What did the legendary messenger announce?', choices: ['A festival', 'A victory in battle', 'A new king', 'A storm'], answer: 1 },
        { q: 'How long is a modern marathon?', choices: ['10 km', '21.1 km', '42.2 km', '100 km'], answer: 2 },
        { q: 'What does marathon training require, according to the passage?', choices: ['Only speed', 'Months of practice and discipline', 'Special shoes only', 'A team'], answer: 1 },
      ],
    },
    {
      id: 'read-s5',
      title: 'The Water Cycle',
      passage:
        'Water is always on the move. The sun heats lakes, rivers, and oceans, turning liquid water into an invisible gas called water vapour, which rises into the air. High up, the vapour cools and gathers into clouds. When the clouds become heavy, the water falls back to Earth as rain, snow, or hail. This never-ending journey is known as the water cycle, and it keeps fresh water flowing around the planet.',
      questions: [
        { q: 'What turns liquid water into vapour?', choices: ['The moon', 'The sun’s heat', 'The wind', 'The soil'], answer: 1 },
        { q: 'What do clouds form from?', choices: ['Dust', 'Cooled water vapour', 'Smoke', 'Sand'], answer: 1 },
        { q: 'Water can fall from clouds as rain, snow, or…', choices: ['Fog', 'Hail', 'Steam', 'Dew'], answer: 1 },
        { q: 'What is this whole journey called?', choices: ['The food chain', 'The water cycle', 'Gravity', 'Erosion'], answer: 1 },
      ],
    },
    {
      id: 'read-s6',
      title: 'The First Flight',
      passage:
        'For centuries, people dreamed of flying like birds. In 1903, two American brothers named Orville and Wilbur Wright finally made that dream real. On a windy beach in North Carolina, their small wood-and-cloth airplane lifted off the ground and flew for twelve seconds. It was a short flight, but it changed the world. Within a few decades, airplanes were carrying people across oceans.',
      questions: [
        { q: 'In what year did the Wright brothers fly?', choices: ['1893', '1903', '1920', '1945'], answer: 1 },
        { q: 'What were the brothers’ first names?', choices: ['Orville and Wilbur', 'Neil and Buzz', 'John and James', 'Tom and Sam'], answer: 0 },
        { q: 'How long did the first flight last?', choices: ['Twelve seconds', 'Twelve minutes', 'One hour', 'A whole day'], answer: 0 },
        { q: 'What was the airplane made of?', choices: ['Steel and glass', 'Wood and cloth', 'Plastic', 'Stone'], answer: 1 },
      ],
    },
    {
      id: 'read-s7',
      title: 'Coral Reefs',
      passage:
        'Coral reefs are sometimes called the rainforests of the sea because so many creatures depend on them. Although a coral looks like a colourful rock or plant, it is actually made of thousands of tiny animals living together. Reefs provide food and shelter for fish, turtles, and countless other sea creatures. Sadly, warmer oceans and pollution can harm reefs, causing them to lose their colour in a process called bleaching.',
      questions: [
        { q: 'Why are coral reefs called the rainforests of the sea?', choices: ['They are green', 'So many creatures depend on them', 'They are tall', 'They float'], answer: 1 },
        { q: 'What is coral actually made of?', choices: ['Rock', 'Plants', 'Thousands of tiny animals', 'Sand'], answer: 2 },
        { q: 'What do reefs provide for sea creatures?', choices: ['Food and shelter', 'Air', 'Sunlight', 'Freshwater'], answer: 0 },
        { q: 'What is it called when reefs lose their colour?', choices: ['Fading', 'Bleaching', 'Melting', 'Drying'], answer: 1 },
      ],
    },
    {
      id: 'read-s8',
      title: 'A Delegate’s Job',
      passage:
        'At a Model United Nations conference, each student plays the role of a delegate representing a country — even one that is not their own. A good delegate researches their country’s history, needs, and opinions, then speaks and negotiates on its behalf. The goal is not to win an argument but to work with other delegates to write a resolution: a document that proposes real solutions to a global problem. Listening carefully and compromising are just as important as speaking well.',
      questions: [
        { q: 'Who does a delegate represent at MUN?', choices: ['Themselves', 'Their school', 'A country', 'Their family'], answer: 2 },
        { q: 'What should a good delegate do before speaking?', choices: ['Research their country', 'Memorise a poem', 'Draw a flag', 'Nothing'], answer: 0 },
        { q: 'What is a resolution?', choices: ['A prize', 'A document proposing solutions', 'A country', 'A vote count'], answer: 1 },
        { q: 'According to the passage, what is as important as speaking well?', choices: ['Listening and compromising', 'Being loudest', 'Winning', 'Dressing up'], answer: 0 },
      ],
    },
  ],
}
