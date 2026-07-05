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
  ],
}
