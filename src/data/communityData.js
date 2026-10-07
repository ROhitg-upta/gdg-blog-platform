/**
 * ============================================================================
 * QUILL EDITORIAL COMMUNITY DATA
 * Structured sample dataset of writers, published stories, and community picks.
 * 
 * NOTE:
 * This is local prototype content crafted for realistic editorial demonstration.
 * Stories feature genuine multi-paragraph essays and authentic metadata.
 * ============================================================================
 */

export const TOPICS = [
  'All topics',
  'Technology',
  'Design',
  'AI',
  'Personal Growth',
  'Culture'
];

export const WRITERS = [
  {
    id: 'writer-devendra',
    name: 'Devendra Patel',
    initials: 'DP',
    bio: 'Compiler engineer exploring humanistic aspects of software systems and digital preservation.',
    topicInterests: ['Technology', 'AI'],
    avatarBg: '#E8DED1',
    avatarColor: '#5C381E'
  },
  {
    id: 'writer-maya',
    name: 'Maya Lindqvist',
    initials: 'ML',
    bio: 'Typographer and book designer investigating visual rhythm, whitespace, and printed margins.',
    topicInterests: ['Design', 'Culture'],
    avatarBg: '#DDD5EA',
    avatarColor: '#43346B'
  },
  {
    id: 'writer-kabir',
    name: 'Kabir Mehta',
    initials: 'KM',
    bio: 'Observational writer reflecting on mindfulness, slow craftsmanship, and unhurried days.',
    topicInterests: ['Personal Growth', 'Culture'],
    avatarBg: '#F0D1BB',
    avatarColor: '#6B3C18'
  },
  {
    id: 'writer-elena',
    name: 'Elena Rostova',
    initials: 'ER',
    bio: 'Essayist and architecture critic examining quiet domestic spaces and urban silence.',
    topicInterests: ['Culture', 'Design'],
    avatarBg: '#DCE3CC',
    avatarColor: '#344E26'
  },
  {
    id: 'writer-aris',
    name: 'Dr. Aris Thorne',
    initials: 'AT',
    bio: 'Cognitive scientist researching human attention in machine-mediated information networks.',
    topicInterests: ['AI', 'Technology'],
    avatarBg: '#D8E2E6',
    avatarColor: '#234454'
  },
  {
    id: 'writer-aanya',
    name: 'Aanya Sharma',
    initials: 'AS',
    bio: 'Literary historian documenting handwritten notebook cultures and tactile writing tools.',
    topicInterests: ['Culture', 'Personal Growth'],
    avatarBg: '#F5DCD2',
    avatarColor: '#6E3224'
  }
];

export const STORIES = [
  {
    id: 'story-cathedrals-silicon',
    slug: 'cathedrals-of-silicon',
    title: 'The Cathedrals of Silicon: Why Enduring Software Feels Like Architecture',
    excerpt: 'How century-old masonry principles teach us to structure digital systems that outlast the organizations that financed them.',
    previewContent: [
      'When we walk through a medieval stone cathedral, we are not merely witnessing stacked limestone; we are experiencing a centuries-long argument about gravity, light, and human endurance.',
      'Modern software, by contrast, is frequently constructed like a temporary carnival pavilion—hastily pitched to catch the prevailing commercial wind, and dismantled the moment customer enthusiasm shifts.',
      'Yet every decade produces a rare handful of systems that feel carved rather than assembled: foundational compilers, operating system kernels, and typography engines whose interfaces remain intuitive forty years later.',
      'The difference lies in reverence for structural truth over superficial ornamentation. When an engineer treats every interface boundary as a load-bearing arch, maintenance ceases to be emergency triage and becomes architectural preservation.'
    ],
    authorId: 'writer-devendra',
    topic: 'Technology',
    publishedAt: '2026-10-06T08:30:00Z',
    readingTime: '6 min read',
    artworkId: 'architectural',
    featured: true
  },
  {
    id: 'story-typography-silence',
    slug: 'typography-of-silence',
    title: 'The Typography of Silence: How Margins Shape Thought',
    excerpt: 'In editorial design, the space surrounding a paragraph is not absence—it is the physical breath that gives words their gravity.',
    previewContent: [
      'Before a single sentence registers in the linguistic cortex, the human eye reads white space. Generous margins communicate composure, while cramped columns induce quiet, subconscious anxiety.',
      'In 16th-century Venetian printing, Aldus Manutius understood that a pocket book was not merely an economical device, but an intimate spatial covenant with a solitary reader.',
      'When we design digital reading rooms, our primary task is defense against claustrophobia. By refusing to crowd the page with unnecessary badges and blinking indicators, we protect the reader’s sacred contemplation.',
      'White space is not expensive emptiness; it is the stage upon which quiet thoughts are permitted to echo.'
    ],
    authorId: 'writer-maya',
    topic: 'Design',
    publishedAt: '2026-10-05T14:15:00Z',
    readingTime: '4 min read',
    artworkId: 'book-lavender',
    featured: false
  },
  {
    id: 'story-attention-synthetic-minds',
    slug: 'attention-in-the-age-of-synthetic-minds',
    title: 'Attention in the Age of Synthetic Minds',
    excerpt: 'When neural models can generate infinite prose in milliseconds, the human ability to pause and edit becomes our rarest faculty.',
    previewContent: [
      'The sudden arrival of synthetic prose has produced an unexpected paradox: writing has never been cheaper to manufacture, yet meaningful essays have never been more difficult to encounter.',
      'When grammatical fluency becomes effortless, volume quickly turns into noise. The value of literature was never in the sheer speed of generation, but in the author’s painful willingness to discard eighty percent of their initial thoughts.',
      'To write well today is fundamentally an exercise in selective refusal. We must choose the slow, handcrafted sentence not because the machine cannot imitate it, but because the human spirit requires the wrestling.'
    ],
    authorId: 'writer-aris',
    topic: 'AI',
    publishedAt: '2026-10-05T09:00:00Z',
    readingTime: '7 min read',
    artworkId: 'algorithmic',
    featured: false
  },
  {
    id: 'story-morning-notebook',
    slug: 'discipline-of-the-morning-notebook',
    title: 'The Discipline of the Morning Notebook',
    excerpt: 'Three unedited pages written before sunrise can unburden the mind from yesterday’s echoes and restore sovereign daylight focus.',
    previewContent: [
      'Morning pages are not meant for public consumption. They are a daily drainage of mental sediment before the external world demands your attention.',
      'By depositing our anxieties onto raw paper before checking a glowing screen, we reclaim custody of our daylight hours. The ink on paper provides a tactile friction that glass screens cannot replicate.',
      'Over months, the practice ceases to be a chore and becomes an emotional sanctuary—a steady reminder that clarity is not found in velocity, but in daily unburdening.'
    ],
    authorId: 'writer-elena',
    topic: 'Personal Growth',
    publishedAt: '2026-10-04T07:45:00Z',
    readingTime: '5 min read',
    artworkId: 'sunlit',
    featured: false
  },
  {
    id: 'story-midnight-bookshops',
    slug: 'midnight-bookshops-of-the-old-quarter',
    title: 'Midnight Bookshops of the Old Quarter',
    excerpt: 'Walking through labyrinthine alleyways where secondhand pages hold century-old conversations across generations.',
    previewContent: [
      'There is a unique tranquility to entering a secondhand bookshop when the street outside has grown quiet and the city settles into rest.',
      'Between aged paper, linen bindings, and penciled margins from fifty years ago lies an unspoken communion of thousands of human lives.',
      'In an era where every transaction is tracked and timed, the rambling bookshop remains one of the last true sanctuaries for unplanned intellectual serendipity.'
    ],
    authorId: 'writer-aanya',
    topic: 'Culture',
    publishedAt: '2026-10-03T18:20:00Z',
    readingTime: '6 min read',
    artworkId: 'portal',
    featured: false
  },
  {
    id: 'story-beauty-of-attention',
    slug: 'beauty-of-paying-attention',
    title: 'The Beauty of Paying Attention: On Slowness as Generosity',
    excerpt: 'In a culture that prizes velocity above all, the rarest luxury is simply staying with a single unhurried moment.',
    previewContent: [
      'To pay attention is perhaps the highest form of generosity we can offer the world. Mary Oliver once observed that attention is the beginning of devotion.',
      'Consider the morning tea: the steam curling upwards like delicate ribbon, the amber light fracturing across the oak table, the soft rustle of leaves outside.',
      'When we skim through existence at hyper-speed, days blend into weeks without texture. Deliberate attention turns the mundane into poetry.'
    ],
    authorId: 'writer-kabir',
    topic: 'Personal Growth',
    publishedAt: '2026-10-02T11:00:00Z',
    readingTime: '5 min read',
    artworkId: 'geometric',
    featured: false
  },
  {
    id: 'story-analog-memory',
    slug: 'analog-roots-of-digital-memory',
    title: 'Analog Roots of Digital Memory: From Parchment to Silicon',
    excerpt: 'Tracing our human obsession with data preservation back through medieval scriptoriums and Mesopotamian clay tablets.',
    previewContent: [
      'Before magnetic tape, magnetic discs, and solid-state arrays, humanity carved its thoughts onto sun-baked clay. The medium may transform, but the impulse remains unchanged.',
      'We construct archives not merely to record inventory, but to reassure ourselves that our transitory experiences matter against the sweep of geological time.',
      'Looking back at the preservation techniques of monastic scribes offers surprising lessons for how we must archive digital knowledge before hardware bit rot takes hold.'
    ],
    authorId: 'writer-devendra',
    topic: 'Technology',
    publishedAt: '2026-10-01T15:30:00Z',
    readingTime: '7 min read',
    artworkId: 'algorithmic',
    featured: false
  },
  {
    id: 'story-scandinavian-print',
    slug: 'restraint-of-scandinavian-printmaking',
    title: 'The Restraint of Scandinavian Printmaking',
    excerpt: 'Lessons in ink absorption, unbleached cotton papers, and the profound power of intentional tactile boundaries.',
    previewContent: [
      'In modern digital interfaces, whitespace is too often treated as empty real estate waiting to be filled with promotional banners and engagement badges.',
      'True elegance, as demonstrated by mid-century Nordic printers, recognizes that white space is the frame that allows the central subject to sing.',
      'By using fewer inks and letting the natural texture of the paper breathe, these craftsmen produced posters and books that remain modern sixty years later.'
    ],
    authorId: 'writer-maya',
    topic: 'Design',
    publishedAt: '2026-09-29T10:10:00Z',
    readingTime: '4 min read',
    artworkId: 'sunlit',
    featured: false
  },
  {
    id: 'story-unhurried-letters',
    slug: 'fading-art-of-unhurried-letters',
    title: 'The Fading Art of Unhurried Letters',
    excerpt: 'What we lost when we traded fountain pens, postal transit, and paper envelopes for instant read receipts.',
    previewContent: [
      'A physical letter demanded deliberate reflection. Because dispatch was slow, the writer measured each paragraph with unhurried care.',
      'A conversation conducted over two weeks allowed thoughts to ripen and soften. It prevented the instant reactionary outbursts that dominate modern comment threads.',
      'Rediscovering epistolary patience might be our greatest cultural antidote to cognitive fragmentation.'
    ],
    authorId: 'writer-aanya',
    topic: 'Culture',
    publishedAt: '2026-09-27T16:40:00Z',
    readingTime: '5 min read',
    artworkId: 'book-lavender',
    featured: false
  },
  {
    id: 'story-saying-no',
    slug: 'learning-to-say-no-to-good-things',
    title: 'Learning to Say No to Good Things',
    excerpt: 'The primary obstacle to monumental creative work is rarely obvious waste—it is the seductive lure of secondary opportunities.',
    previewContent: [
      'It is relatively effortless to decline commitments that are clearly frivolous. The insidious trap is saying yes to a dozen genuinely good, flattering projects.',
      'Every yes to a secondary endeavor is a quiet, cumulative death blow to the masterwork you were placed here to write.',
      'Ruthless curation of your daily obligations is the only soil in which deep mastery can take root.'
    ],
    authorId: 'writer-kabir',
    topic: 'Personal Growth',
    publishedAt: '2026-09-25T13:00:00Z',
    readingTime: '5 min read',
    artworkId: 'geometric',
    featured: false
  },
  {
    id: 'story-synthetic-dialogue',
    slug: 'when-language-models-reason-in-public',
    title: 'When Language Models Reason in Public',
    excerpt: 'Examining what happens to human discourse when conversational neural agents participate in philosophical inquiry.',
    previewContent: [
      'Language has always been the primary vehicle through which humans test their moral convictions and refine abstract models of justice.',
      'When autonomous models enter these conversations, we are forced to distinguish between stylistic mimicry of wisdom and authentic moral agency.',
      'This boundary requires new frameworks not only in computer science, but in rhetoric, ethics, and civic pedagogy.'
    ],
    authorId: 'writer-aris',
    topic: 'AI',
    publishedAt: '2026-09-23T08:15:00Z',
    readingTime: '6 min read',
    artworkId: 'portal',
    featured: false
  }
];

export const COMMUNITY_PICKS = [
  {
    id: 'story-cathedrals-silicon',
    title: 'The Cathedrals of Silicon',
    authorName: 'Devendra Patel',
    readingTime: '6 min read'
  },
  {
    id: 'story-typography-silence',
    title: 'The Typography of Silence',
    authorName: 'Maya Lindqvist',
    readingTime: '4 min read'
  },
  {
    id: 'story-beauty-of-attention',
    title: 'The Beauty of Paying Attention',
    authorName: 'Kabir Mehta',
    readingTime: '5 min read'
  }
];

export const WEEKLY_PROMPT = {
  theme: 'Writing prompt of the week',
  question: 'What belief or perspective did you quietly change your mind about this year?',
  actionText: 'Write your first story'
};

/**
 * Helper to get author details by ID
 */
export function getWriterById(writerId) {
  return WRITERS.find((w) => w.id === writerId) || {
    id: writerId,
    name: 'Quill Writer',
    initials: 'QW',
    bio: 'Independent contributor to the Quill community.',
    avatarBg: '#EBE5D8',
    avatarColor: '#1E1C1A'
  };
}

/**
 * Hydrates a story with its full writer object and formatted date
 */
export function hydrateStory(story) {
  const author = getWriterById(story.authorId);
  const dateObj = new Date(story.publishedAt);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return {
    ...story,
    author,
    date: formattedDate
  };
}

/**
 * Returns all stories fully hydrated with author information
 */
export function getAllHydratedStories() {
  return STORIES.map(hydrateStory);
}
