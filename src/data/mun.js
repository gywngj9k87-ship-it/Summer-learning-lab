// Model UN prep for Niall — the two tracks the parent chose:
// (1) country facts and (2) current world events / global organizations.
// answer = index into choices. Ordered roughly easy -> hard within the list.
export const mun = {
  senior: [
    // --- Country facts ---
    { id: 'mun-c1', q: 'What is the capital of France?', choices: ['Lyon', 'Paris', 'Nice', 'Marseille'], answer: 1, tag: 'Country facts' },
    { id: 'mun-c2', q: 'Which country’s flag is a red circle on a white background?', choices: ['China', 'Japan', 'South Korea', 'Vietnam'], answer: 1, tag: 'Country facts' },
    { id: 'mun-c3', q: 'The capital of Canada is…', choices: ['Toronto', 'Ottawa', 'Vancouver', 'Calgary'], answer: 1, tag: 'Country facts' },
    { id: 'mun-c4', q: 'New Delhi is the capital of…', choices: ['Pakistan', 'India', 'Bangladesh', 'Nepal'], answer: 1, tag: 'Country facts' },
    { id: 'mun-c5', q: 'Kenya is located on which continent?', choices: ['Asia', 'Africa', 'South America', 'Europe'], answer: 1, tag: 'Country facts' },
    { id: 'mun-c6', q: 'The capital of Egypt is…', choices: ['Alexandria', 'Cairo', 'Giza', 'Luxor'], answer: 1, tag: 'Country facts' },
    { id: 'mun-c7', q: 'Which country is led by a Chancellor, with its capital in Berlin?', choices: ['Austria', 'Germany', 'Switzerland', 'Netherlands'], answer: 1, tag: 'Country facts' },
    { id: 'mun-c8', q: 'The capital of Brazil is…', choices: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'], answer: 2, tag: 'Country facts' },
    { id: 'mun-c9', q: 'Which country spans the most time zones, with its capital in Moscow?', choices: ['China', 'Canada', 'Russia', 'USA'], answer: 2, tag: 'Country facts' },
    { id: 'mun-c10', q: 'The capital of Australia is…', choices: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], answer: 2, tag: 'Country facts' },
    { id: 'mun-c11', q: 'Which of these countries is a permanent member of the UN Security Council?', choices: ['India', 'Brazil', 'France', 'Germany'], answer: 2, tag: 'Country facts' },
    { id: 'mun-c12', q: 'Nairobi is the capital of…', choices: ['Nigeria', 'Kenya', 'Ghana', 'Tanzania'], answer: 1, tag: 'Country facts' },
    { id: 'mun-c13', q: 'Which country uses the euro as its currency?', choices: ['United Kingdom', 'France', 'Japan', 'Canada'], answer: 1, tag: 'Country facts' },
    { id: 'mun-c14', q: 'The capital of China is…', choices: ['Shanghai', 'Beijing', 'Hong Kong', 'Guangzhou'], answer: 1, tag: 'Country facts' },
    { id: 'mun-c15', q: 'Which country has the largest population in Africa?', choices: ['Egypt', 'Nigeria', 'South Africa', 'Ethiopia'], answer: 1, tag: 'Country facts' },
    { id: 'mun-c16', q: 'The capital of South Korea is…', choices: ['Busan', 'Seoul', 'Incheon', 'Pyongyang'], answer: 1, tag: 'Country facts' },
    { id: 'mun-c17', q: 'Which country is officially neutral and hosts many UN offices in Geneva?', choices: ['Belgium', 'Switzerland', 'Austria', 'Sweden'], answer: 1, tag: 'Country facts' },

    // --- Current world events / global organizations ---
    { id: 'mun-e1', q: 'What does “UN” stand for?', choices: ['United Nations', 'Universal Network', 'United Neighbours', 'Unity Now'], answer: 0, tag: 'World affairs' },
    { id: 'mun-e2', q: 'The UN’s headquarters is in which city?', choices: ['Geneva', 'New York City', 'Paris', 'Vienna'], answer: 1, tag: 'World affairs' },
    { id: 'mun-e3', q: 'The main UN body where every member country has one vote is the…', choices: ['Security Council', 'General Assembly', 'World Bank', 'Supreme Court'], answer: 1, tag: 'World affairs' },
    { id: 'mun-e4', q: 'A delegate at MUN represents the views of their assigned…', choices: ['Family', 'School', 'Country', 'Favourite team'], answer: 2, tag: 'World affairs' },
    { id: 'mun-e5', q: 'Which organization works to protect children’s rights worldwide?', choices: ['UNICEF', 'NATO', 'WTO', 'OPEC'], answer: 0, tag: 'World affairs' },
    { id: 'mun-e6', q: 'The WHO deals mainly with global…', choices: ['Trade', 'Health', 'Weather', 'Sports'], answer: 1, tag: 'World affairs' },
    { id: 'mun-e7', q: 'A written proposal that delegates debate and vote on at MUN is called a…', choices: ['Petition', 'Resolution', 'Contract', 'Memo'], answer: 1, tag: 'World affairs' },
    { id: 'mun-e8', q: 'How many countries are members of the United Nations (approximately)?', choices: ['About 50', 'About 100', 'About 195', 'About 300'], answer: 2, tag: 'World affairs' },
    { id: 'mun-e9', q: 'The Paris Agreement is an international treaty about…', choices: ['Climate change', 'Space travel', 'Internet rules', 'Olympic games'], answer: 0, tag: 'World affairs' },
    { id: 'mun-e10', q: 'The five permanent members of the Security Council hold a special power called the…', choices: ['Veto', 'Motion', 'Quorum', 'Caucus'], answer: 0, tag: 'World affairs' },
    { id: 'mun-e11', q: 'UNESCO is the UN agency for education, science and…', choices: ['Culture', 'Farming', 'Mining', 'Banking'], answer: 0, tag: 'World affairs' },
    { id: 'mun-e12', q: 'Which organization is a military alliance of North American and European nations?', choices: ['ASEAN', 'NATO', 'UNICEF', 'WHO'], answer: 1, tag: 'World affairs' },
    { id: 'mun-e13', q: 'At MUN, asking to speak or change the debate is done by raising a…', choices: ['Motion', 'Flag', 'Poster', 'Bell'], answer: 0, tag: 'World affairs' },
    { id: 'mun-e14', q: 'The head of the United Nations is called the…', choices: ['President', 'Secretary-General', 'Prime Minister', 'Chairman'], answer: 1, tag: 'World affairs' },
    { id: 'mun-e15', q: 'The World Trade Organization (WTO) sets rules for global…', choices: ['Trade', 'Health', 'Sport', 'Travel'], answer: 0, tag: 'World affairs' },
    { id: 'mun-e16', q: 'The UN’s 17 goals for a better world by 2030 are called the Sustainable Development…', choices: ['Rules', 'Goals', 'Laws', 'Plans'], answer: 1, tag: 'World affairs' },
    { id: 'mun-e17', q: 'How many permanent members does the UN Security Council have?', choices: ['3', '5', '10', '15'], answer: 1, tag: 'World affairs' },
    { id: 'mun-e18', q: 'A group of delegates informally working together on a resolution is called a…', choices: ['Bloc', 'Team', 'Club', 'Squad'], answer: 0, tag: 'World affairs' },
  ],
  junior: [], // MUN is Niall-only
}
