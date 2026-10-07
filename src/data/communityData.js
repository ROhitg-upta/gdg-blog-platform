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
  },
  {
    id: 'writer-riya',
    name: 'Riya Sen',
    initials: 'RS',
    bio: 'Creative mentor and essayist exploring quiet thought architecture and generative pauses.',
    topicInterests: ['Personal Growth', 'Culture'],
    avatarBg: '#E2DCEF',
    avatarColor: '#2B243D'
  }
];

export const STORIES = [
  {
    id: 'story-cathedrals-silicon',
    slug: 'cathedrals-of-silicon',
    title: 'The Cathedrals of Silicon: Why Enduring Software Feels Like Architecture',
    subtitle: 'Lessons in permanence, load-bearing boundaries, and craftsmanship drawn from medieval stonework.',
    excerpt: 'How century-old masonry principles teach us to structure digital systems that outlast the organizations that financed them.',
    authorId: 'writer-devendra',
    topic: 'Technology',
    publishedAt: '2026-10-06T08:30:00Z',
    readingTime: '6 min read',
    artworkId: 'architectural',
    featured: true,
    previewContent: [
      'When we walk through a medieval stone cathedral, we are not merely witnessing stacked limestone; we are experiencing a centuries-long argument about gravity, light, and human endurance.',
      'Modern software, by contrast, is frequently constructed like a temporary carnival pavilion—hastily pitched to catch the prevailing commercial wind, and dismantled the moment customer enthusiasm shifts.',
      'Yet every decade produces a rare handful of systems that feel carved rather than assembled: foundational compilers, operating system kernels, and typography engines whose interfaces remain intuitive forty years later.',
      'The difference lies in reverence for structural truth over superficial ornamentation. When an engineer treats every interface boundary as a load-bearing arch, maintenance ceases to be emergency triage and becomes architectural preservation.'
    ],
    content: [
      {
        type: 'paragraph',
        text: 'When we walk through a medieval stone cathedral, we are not merely witnessing stacked limestone; we are experiencing a centuries-long argument about gravity, light, and human endurance. The master masons of Chartres and Durham understood that their work would be judged not by the speed of initial assembly, but by how graciously the structure absorbed the slow settling of the earth beneath it.'
      },
      {
        type: 'paragraph',
        text: 'Modern software engineering, by contrast, operates under a perpetual carnival mentality. We pitch temporary canvas tents to catch whatever commercial breeze is blowing this quarter, celebrate our rapid deployment velocity, and then express bewilderment when the fabric tears during the first unpredicted storm.'
      },
      {
        type: 'heading',
        text: 'The Fiction of Disposability'
      },
      {
        type: 'paragraph',
        text: 'In the early days of personal computing, software was treated as an artifact. It was shipped on stamped physical media, accompanied by clothbound manuals, and expected to execute reliably on hardware that would remain static for half a decade. Today, the ubiquity of continuous integration has seduced us into believing that all mistakes are instantly reversible.'
      },
      {
        type: 'quote',
        text: 'When everything can be patched in forty seconds, nobody feels the moral weight of pouring a defective foundation.',
        attribution: 'Devendra Patel'
      },
      {
        type: 'paragraph',
        text: 'Yet every decade produces a rare handful of software systems that possess cathedral-like permanence: the Unix process model, TeX typography engine, SQLite storage architecture, and the foundational algorithms of packet switching. These systems were not built faster than their peers; they were built with deeper structural restraint.'
      },
      {
        type: 'heading',
        text: 'Architectural Restraint as an Engineering Ethic'
      },
      {
        type: 'paragraph',
        text: 'What distinguishes enduring software from transitory hype is rarely computational cleverness. More often, it is the author’s willingness to say no to seductive conveniences that compromise interface purity:'
      },
      {
        type: 'list',
        items: [
          'Treating interface boundaries as immutable contracts rather than fluid drafts.',
          'Minimizing hidden side-effects that ripple silently across decoupled subsystems.',
          'Valuing zero-dependency local predictability over third-party convenience packages.',
          'Designing for transparent diagnostics fifty years after the original authors have departed.'
        ]
      },
      {
        type: 'paragraph',
        text: 'As software systems take custody of human medical records, civic governance, and creative memory, our responsibilities shift from rapid prototyping to generational preservation. When we sit down to write code, we must ask ourselves whether we are pitching another disposable carnival tent or laying stone that can bear the weight of centuries.'
      }
    ]
  },
  {
    id: 'story-typography-silence',
    slug: 'typography-of-silence',
    title: 'The Typography of Silence: How Margins Shape Thought',
    subtitle: 'Why the space surrounding a paragraph is the physical breath that gives words their gravity.',
    excerpt: 'In editorial design, the space surrounding a paragraph is not absence—it is the physical breath that gives words their gravity.',
    authorId: 'writer-maya',
    topic: 'Design',
    publishedAt: '2026-10-05T14:15:00Z',
    readingTime: '4 min read',
    artworkId: 'book-lavender',
    featured: false,
    previewContent: [
      'Before a single sentence registers in the linguistic cortex, the human eye reads white space. Generous margins communicate composure, while cramped columns induce quiet, subconscious anxiety.',
      'In 16th-century Venetian printing, Aldus Manutius understood that a pocket book was not merely an economical device, but an intimate spatial covenant with a solitary reader.',
      'When we design digital reading rooms, our primary task is defense against claustrophobia. By refusing to crowd the page with unnecessary badges and blinking indicators, we protect the reader’s sacred contemplation.',
      'White space is not expensive emptiness; it is the stage upon which quiet thoughts are permitted to echo.'
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Before a single sentence registers in the linguistic cortex, the human eye reads white space. Before you comprehend the grammar of this phrase, your nervous system has already evaluated the margin: the generous buffer between the text block and the edge of your screen. That blank paper communicates composure before semantic meaning begins.'
      },
      {
        type: 'paragraph',
        text: 'In 16th-century Venetian printing, Aldus Manutius understood that a printed book was not merely an economical device for storing letters, but an intimate spatial covenant between author and solitary reader. The margins of his octavo editions were carefully calculated to provide resting room for the reader’s thumbs and breathing room for the eye.'
      },
      {
        type: 'heading',
        text: 'The Modern Panic of Empty Space'
      },
      {
        type: 'paragraph',
        text: 'In contemporary digital product design, whitespace is routinely treated as wasted inventory. Marketing teams see unallocated pixels and immediately rush to install newsletter modals, social proof badges, floating reaction counters, and related article sidebars.'
      },
      {
        type: 'quote',
        text: 'A page without margins is like a room with no doors: you may enter, but you can never breathe.',
        attribution: 'Jan Tschichold'
      },
      {
        type: 'paragraph',
        text: 'When we crowd an editorial layout with frantic stimuli, we degrade the reader’s cognitive capacity. Deep reading requires an uninterrupted rhythm. If the page continually whispers "look over here" with floating chrome and flickering notifications, contemplation collapses into skimming.'
      },
      {
        type: 'heading',
        text: 'Designing the Quiet Reading Room'
      },
      {
        type: 'paragraph',
        text: 'To design for silence is to practice intentional omission. In Quill, every decision—from the 680-pixel reading column to the warm linen paper tint—is calibrated to defend your attention against intrusion. White space is not absence; it is the physical presence of stillness that permits an essay to resonate long after you close the tab.'
      }
    ]
  },
  {
    id: 'story-attention-synthetic-minds',
    slug: 'attention-in-the-age-of-synthetic-minds',
    title: 'Attention in the Age of Synthetic Minds',
    subtitle: 'When neural models generate infinite prose, the human ability to pause and edit becomes our rarest faculty.',
    excerpt: 'When neural models can generate infinite prose in milliseconds, the human ability to pause and edit becomes our rarest faculty.',
    authorId: 'writer-aris',
    topic: 'AI',
    publishedAt: '2026-10-05T09:00:00Z',
    readingTime: '7 min read',
    artworkId: 'algorithmic',
    featured: false,
    previewContent: [
      'The sudden arrival of synthetic prose has produced an unexpected paradox: writing has never been cheaper to manufacture, yet meaningful essays have never been more difficult to encounter.',
      'When grammatical fluency becomes effortless, volume quickly turns into noise. The value of literature was never in the sheer speed of generation, but in the author’s painful willingness to discard eighty percent of their initial thoughts.',
      'To write well today is fundamentally an exercise in selective refusal. We must choose the slow, handcrafted sentence not because the machine cannot imitate it, but because the human spirit requires the wrestling.'
    ],
    content: [
      {
        type: 'paragraph',
        text: 'The sudden arrival of synthetic prose has produced an unexpected cultural paradox: articulate writing has never been cheaper to manufacture, yet essays that actually matter have never been more difficult to discover.'
      },
      {
        type: 'paragraph',
        text: 'When language models can generate twelve grammatical paragraphs on any subject in three seconds, fluency ceases to be a reliable proxy for deep insight. A machine can effortlessly reproduce the syntactic cadences of Joan Didion or Christopher Hitchens, but it has never walked down a rain-slicked boulevard in grief, nor has it ever risked anything to discover what it believes.'
      },
      {
        type: 'heading',
        text: 'The Value of Discarded Drafts'
      },
      {
        type: 'paragraph',
        text: 'The fundamental error of algorithmic text generation is confusing generation with thought. Literature is not constructed by stringing likely tokens together; it is forged by the agonizing process of elimination. An essayist spends hours discarding half-formed analogies, deleting rhetorical flourishes, and confronting their own intellectual cowardice.'
      },
      {
        type: 'quote',
        text: 'The machine generates because it cannot feel shame. The human edits because they care about the truth.',
        attribution: 'Dr. Aris Thorne'
      },
      {
        type: 'paragraph',
        text: 'When we outsource composition entirely to synthetic networks, we are not merely saving time; we are bypassing the psychological crucible that transforms unexamined assumptions into coherent convictions.'
      },
      {
        type: 'heading',
        text: 'The Sanctuary of Slow Attention'
      },
      {
        type: 'paragraph',
        text: 'What becomes valuable in an age of infinite synthetic noise? The answers are unmistakably human:'
      },
      {
        type: 'list',
        items: [
          'Vulnerability: Speaking from a specific, fallible mortal perspective.',
          'Patience: Giving a complicated paradox three weeks of reflection rather than thirty seconds.',
          'Texture: Retaining the idiosyncratic oddities that algorithmic smoothing tends to erase.',
          'Silence: Knowing when to stop writing because the thought is complete.'
        ]
      },
      {
        type: 'paragraph',
        text: 'The future of reading belongs not to platforms that flood feeds with infinite synthetic summaries, but to quiet rooms where human beings gather to share what they have wrestled from life.'
      }
    ]
  },
  {
    id: 'story-morning-notebook',
    slug: 'discipline-of-the-morning-notebook',
    title: 'The Discipline of the Morning Notebook',
    subtitle: 'How three unedited pages written before sunrise restore sovereign focus in a world of constant notification.',
    excerpt: 'Three unedited pages written before sunrise can unburden the mind from yesterday’s echoes and restore sovereign daylight focus.',
    authorId: 'writer-elena',
    topic: 'Personal Growth',
    publishedAt: '2026-10-04T07:45:00Z',
    readingTime: '5 min read',
    artworkId: 'sunlit',
    featured: false,
    previewContent: [
      'Morning pages are not meant for public consumption. They are a daily drainage of mental sediment before the external world demands your attention.',
      'By depositing our anxieties onto raw paper before checking a glowing screen, we reclaim custody of our daylight hours. The ink on paper provides a tactile friction that glass screens cannot replicate.',
      'Over months, the practice ceases to be a chore and becomes an emotional sanctuary—a steady reminder that clarity is not found in velocity, but in daily unburdening.'
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Morning pages are not meant for public consumption. They are not literature, they are not draft material, and they should never be evaluated by an internal editor. They are simply the daily drainage of mental sediment before the world demands your attention.'
      },
      {
        type: 'paragraph',
        text: 'Most people begin their day in a posture of psychological defense. The alarm rings, the hand reaches reflexively for the glowing rectangle, and within ninety seconds the mind is colonized by headlines, unread emails, and the opinions of distant strangers.'
      },
      {
        type: 'heading',
        text: 'The Tactile Friction of Ink'
      },
      {
        type: 'paragraph',
        text: 'When you sit at a quiet table with a notebook and fountain pen, something fundamental shifts in your relationship with thought. Unlike a text editor, paper offers no backspace key. You cannot highlight a paragraph to rearrange its syntax. You are forced to witness your mind as it actually is: clumsy, repetitive, and occasionally brilliant.'
      },
      {
        type: 'quote',
        text: 'The notebook does not judge your trivial anxieties. It simply absorbs them so you do not carry them into daylight.',
        attribution: 'Elena Rostova'
      },
      {
        type: 'paragraph',
        text: 'Write three pages of raw stream-of-consciousness prose before opening a browser tab. Complain about the draft in the kitchen, note the angle of gray light through the cedar trees, list your irrational anxieties, and let the pen scrape along until the third page is covered.'
      },
      {
        type: 'paragraph',
        text: 'By the time you close the notebook and step into the day, the psychological fog has cleared. You have emptied yesterday’s ash from the hearth, and your daylight hours belong entirely to you.'
      }
    ]
  },
  {
    id: 'story-midnight-bookshops',
    slug: 'midnight-bookshops-of-the-old-quarter',
    title: 'Midnight Bookshops of the Old Quarter',
    subtitle: 'Wandering through labyrinthine alleyways where secondhand pages preserve century-old conversations.',
    excerpt: 'Walking through labyrinthine alleyways where secondhand pages hold century-old conversations across generations.',
    authorId: 'writer-aanya',
    topic: 'Culture',
    publishedAt: '2026-10-03T18:20:00Z',
    readingTime: '6 min read',
    artworkId: 'portal',
    featured: false,
    previewContent: [
      'There is a unique tranquility to entering a secondhand bookshop when the street outside has grown quiet and the city settles into rest.',
      'Between aged paper, linen bindings, and penciled margins from fifty years ago lies an unspoken communion of thousands of human lives.',
      'In an era where every transaction is tracked and timed, the rambling bookshop remains one of the last true sanctuaries for unplanned intellectual serendipity.'
    ],
    content: [
      {
        type: 'paragraph',
        text: 'There is a unique tranquility to entering a secondhand bookshop when the street outside has grown quiet and the city settles into rest. Rain taps against the leaded glass windows, the radiator hisses gently in the corner, and the scent of aged cellulose and dried binding glue hangs heavy in the air.'
      },
      {
        type: 'paragraph',
        text: 'In modern online bookstores, discovery has been flattened by recommendation algorithms. You purchase a volume on 20th-century urbanism, and the machine immediately queues up eight nearly identical volumes. The serendipity of the wandering mind is systematically replaced by the efficient funnel of the commercial engine.'
      },
      {
        type: 'heading',
        text: 'The Margin Notes of Strangers'
      },
      {
        type: 'paragraph',
        text: 'In the old bookshops of Prague, Edinburgh, and Kyoto, books are organized not by algorithmic prediction, but by the physical history of their survival. You pull an unjacketed edition of Montaigne from an overstuffed shelf and discover delicate penciled annotations written by an unknown reader in 1948.'
      },
      {
        type: 'quote',
        text: 'To read a secondhand book is to participate in an intimate conversation with every hand that previously turned the leaf.',
        attribution: 'Aanya Sharma'
      },
      {
        type: 'paragraph',
        text: 'Here, you do not find what you were looking for; you find what you did not know you needed. A monograph on Japanese joinery sits beside an essay collection on astronomy, which rests against a dog-eared volume of Spanish poetry. In that accidental friction between unrelated ideas lies the spark of original thought.'
      },
      {
        type: 'paragraph',
        text: 'May we preserve these sacred, dusty labyrinths. They remind us that the internet may contain all existing data, but the secondhand bookshop preserves human curiosity in its purest, most disorganized glory.'
      }
    ]
  },
  {
    id: 'story-beauty-of-attention',
    slug: 'beauty-of-paying-attention',
    title: 'The Beauty of Paying Attention: On Slowness as Generosity',
    subtitle: 'Why staying with a single unhurried moment is our highest form of devotion to the world.',
    excerpt: 'In a culture that prizes velocity above all, the rarest luxury is simply staying with a single unhurried moment.',
    authorId: 'writer-kabir',
    topic: 'Personal Growth',
    publishedAt: '2026-10-02T11:00:00Z',
    readingTime: '5 min read',
    artworkId: 'geometric',
    featured: false,
    previewContent: [
      'To pay attention is perhaps the highest form of generosity we can offer the world. Mary Oliver once observed that attention is the beginning of devotion.',
      'Consider the morning tea: the steam curling upwards like delicate ribbon, the amber light fracturing across the oak table, the soft rustle of leaves outside.',
      'When we skim through existence at hyper-speed, days blend into weeks without texture. Deliberate attention turns the mundane into poetry.'
    ],
    content: [
      {
        type: 'paragraph',
        text: 'To pay attention is perhaps the highest form of generosity we can offer the world. Mary Oliver once observed that attention is the beginning of devotion, and to witness the ordinary world closely is to find oneself continually re-enchanted with existence.'
      },
      {
        type: 'paragraph',
        text: 'Consider the morning tea: the steam curling upwards in delicate ribbons, the amber light fracturing across the grain of the oak table, the soft rustle of dry leaves scraping the courtyard flagstones outside. In ordinary life, we step past these moments as if they were merely stage background for our urgent appointments.'
      },
      {
        type: 'heading',
        text: 'The Disease of Acceleration'
      },
      {
        type: 'paragraph',
        text: 'When we skim through days at 1.5x speed, existence loses its tactile texture. We remember milestones—the promotion, the move, the vacation—but forget that eighty percent of life unfolds in the quiet interstitial spaces between milestones.'
      },
      {
        type: 'quote',
        text: 'Hurry is not a sign of vitality; it is the frantic reflex of an organism terrified of stillness.',
        attribution: 'Kabir Mehta'
      },
      {
        type: 'paragraph',
        text: 'Try this experiment today: When someone speaks to you, listen without rehearsing your clever rebuttal. Notice the grain of the wooden handrail beneath your fingers as you climb the stairs. Gaze at the clouds passing over the rooftop for three full minutes without touching your phone.'
      },
      {
        type: 'paragraph',
        text: 'Slowness is not sluggishness; it is reverence. By refusing to accelerate through your afternoon, you transform the mundane into enduring poetry.'
      }
    ]
  },
  {
    id: 'story-analog-memory',
    slug: 'analog-roots-of-digital-memory',
    title: 'Analog Roots of Digital Memory: From Parchment to Silicon',
    subtitle: 'What medieval scriptoriums teach us about preserving digital knowledge against bit rot.',
    excerpt: 'Tracing our human obsession with data preservation back through medieval scriptoriums and Mesopotamian clay tablets.',
    authorId: 'writer-devendra',
    topic: 'Technology',
    publishedAt: '2026-10-01T15:30:00Z',
    readingTime: '7 min read',
    artworkId: 'algorithmic',
    featured: false,
    previewContent: [
      'Before magnetic tape, magnetic discs, and solid-state arrays, humanity carved its thoughts onto sun-baked clay. The medium may transform, but the impulse remains unchanged.',
      'We construct archives not merely to record inventory, but to reassure ourselves that our transitory experiences matter against the sweep of geological time.',
      'Looking back at the preservation techniques of monastic scribes offers surprising lessons for how we must archive digital knowledge before hardware bit rot takes hold.'
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Before magnetic tape, spinning platters, and flash semiconductor arrays, humanity inscribed its laws and songs onto sun-baked Sumerian clay. The storage medium transforms with every technological era, but the underlying psychological impulse remains unchanged across four millennia.'
      },
      {
        type: 'paragraph',
        text: 'We construct archives not merely to keep track of grain shipments or bank balances, but to reassure ourselves that our transitory experiences matter against the merciless sweep of geological time. We write so that our descendants might know we loved, questioned, and endured.'
      },
      {
        type: 'heading',
        text: 'The Paradox of Digital Fragility'
      },
      {
        type: 'paragraph',
        text: 'We pride ourselves on living in the most information-dense civilization in history, yet our records are far more fragile than those of the ancient Mediterranean. An inscription carved into basalt survives two thousand years of rain and conquerors. A document stored in a proprietary binary format on a magnetic server can become unreadable within twelve years due to codec abandonment and bit rot.'
      },
      {
        type: 'quote',
        text: 'We have built a digital Alexandria that requires continuous electrical power just to keep the ink from evaporating.',
        attribution: 'Devendra Patel'
      },
      {
        type: 'paragraph',
        text: 'The monks of early medieval Ireland understood that preservation was not an automated passive state; it was an active ritual of constant transcription. When parchment decayed, a new novice dipped a quill and copied the codex by hand. That manual cycle prevented text from becoming invisible.'
      },
      {
        type: 'paragraph',
        text: 'If our digital culture is to outlive our hardware vendors, we must embrace simple, human-readable open standards: plain UTF-8 text, vector graphics, and decentralized local copies. The future of preservation is not more proprietary clouds, but the ancient discipline of the resilient scribe.'
      }
    ]
  },
  {
    id: 'story-scandinavian-print',
    slug: 'restraint-of-scandinavian-printmaking',
    title: 'The Restraint of Scandinavian Printmaking',
    subtitle: 'Tactile boundaries, unbleached papers, and the quiet visual power of mid-century Nordic posters.',
    excerpt: 'Lessons in ink absorption, unbleached cotton papers, and the profound power of intentional tactile boundaries.',
    authorId: 'writer-maya',
    topic: 'Design',
    publishedAt: '2026-09-29T10:10:00Z',
    readingTime: '4 min read',
    artworkId: 'sunlit',
    featured: false,
    previewContent: [
      'In modern digital interfaces, whitespace is too often treated as empty real estate waiting to be filled with promotional banners and engagement badges.',
      'True elegance, as demonstrated by mid-century Nordic printers, recognizes that white space is the frame that allows the central subject to sing.',
      'By using fewer inks and letting the natural texture of the paper breathe, these craftsmen produced posters and books that remain modern sixty years later.'
    ],
    content: [
      {
        type: 'paragraph',
        text: 'In modern graphic communication, excess is the default setting. Digital tools allow millions of colors, infinite photographic layers, and gradient blurs at zero incremental cost. Because everything is computationally possible, designers frequently forget why restraint was ever celebrated.'
      },
      {
        type: 'paragraph',
        text: 'Step into an archive of mid-century Scandinavian posters from Stockholm or Copenhagen, and you encounter an entirely different design philosophy. Working with limited ink palettes—often just burnt ochre, soot black, and unbleached cotton cream—Nordic printers produced compositions of staggering authority.'
      },
      {
        type: 'heading',
        text: 'Letting the Material Breathe'
      },
      {
        type: 'paragraph',
        text: 'The Scandinavian master printer understood that ink absorption was a physical collaboration with paper fibers. If you flood a poster with synthetic pigments, you smother the tactile warmth of the substrate. By letting eighty percent of the sheet remain unprinted, the paper itself becomes the primary aesthetic actor.'
      },
      {
        type: 'quote',
        text: 'Elegance is not achieved when there is nothing left to add, but when there is nothing left that can be removed without losing the soul.',
        attribution: 'Maya Lindqvist'
      },
      {
        type: 'paragraph',
        text: 'When designing interfaces for Quill, we returned repeatedly to this printmaking discipline. By restricting our palette to warm linen paper, deep ink, and terracotta accents, we ensure that the typography carries the emotional weight of the platform without relying on visual tricks.'
      }
    ]
  },
  {
    id: 'story-unhurried-letters',
    slug: 'fading-art-of-unhurried-letters',
    title: 'The Fading Art of Unhurried Letters',
    subtitle: 'What epistolary delays taught humanity about patience, nuance, and emotional dignity.',
    excerpt: 'What we lost when we traded fountain pens, postal transit, and paper envelopes for instant read receipts.',
    authorId: 'writer-aanya',
    topic: 'Culture',
    publishedAt: '2026-09-27T16:40:00Z',
    readingTime: '5 min read',
    artworkId: 'book-lavender',
    featured: false,
    previewContent: [
      'A physical letter demanded deliberate reflection. Because dispatch was slow, the writer measured each paragraph with unhurried care.',
      'A conversation conducted over two weeks allowed thoughts to ripen and soften. It prevented the instant reactionary outbursts that dominate modern comment threads.',
      'Rediscovering epistolary patience might be our greatest cultural antidote to cognitive fragmentation.'
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Before instant messaging and synchronized read receipts, communication was fundamentally defined by the physical interval between dispatch and arrival. A letter dispatched across the sea could take twelve days to reach its destination, and the reply would require another fortnight to make its return voyage.'
      },
      {
        type: 'paragraph',
        text: 'Modern observers tend to view this transit delay as a frustrating technical handicap. But in practice, postal delay was an extraordinary emotional buffer. Because a letter could not be rescinded once dropped into the copper pillar box, the writer was forced to measure every phrase with care.'
      },
      {
        type: 'heading',
        text: 'The Cooling Chamber of Transit'
      },
      {
        type: 'paragraph',
        text: 'How many bitter grievances would have dissolved into harmless mist if our modern messaging apps enforced a forty-eight-hour cooling period before delivery? In the 19th century, an angry correspondent might compose a scathing draft by candlelight, sleep on it, and burn the paper before the morning post carriage arrived.'
      },
      {
        type: 'quote',
        text: 'Distance in time produces the same softening effect upon prose that atmospheric haze produces upon distant mountains.',
        attribution: 'Aanya Sharma'
      },
      {
        type: 'paragraph',
        text: 'The epistolary tradition also taught the art of long-form contemplation. You did not write to announce that you had purchased groceries; you wrote to describe the state of your garden, the grief you had been quietly wrestling with, or the strange book you had read until dawn.'
      },
      {
        type: 'paragraph',
        text: 'While we will not abandon our instant networks, we can deliberately reintroduce epistolary patience into how we write essays. When you draft on Quill, take two days before hitting publish. Let the words sit in the cooling chamber of your mind until they are gentle, honest, and ripe.'
      }
    ]
  },
  {
    id: 'story-saying-no',
    slug: 'learning-to-say-no-to-good-things',
    title: 'Learning to Say No to Good Things',
    subtitle: 'Why secondary opportunities are far more dangerous to creative mastery than obvious distractions.',
    excerpt: 'The primary obstacle to monumental creative work is rarely obvious waste—it is the seductive lure of secondary opportunities.',
    authorId: 'writer-kabir',
    topic: 'Personal Growth',
    publishedAt: '2026-09-25T13:00:00Z',
    readingTime: '5 min read',
    artworkId: 'geometric',
    featured: false,
    previewContent: [
      'It is relatively effortless to decline commitments that are clearly frivolous. The insidious trap is saying yes to a dozen genuinely good, flattering projects.',
      'Every yes to a secondary endeavor is a quiet, cumulative death blow to the masterwork you were placed here to write.',
      'Ruthless curation of your daily obligations is the only soil in which deep mastery can take root.'
    ],
    content: [
      {
        type: 'paragraph',
        text: 'It is relatively effortless to decline commitments that are blatantly wasteful. Any self-respecting writer can turn down a mindless phone call, a trivial meeting, or hours of aimless scrolling. The truly insidious danger to monumental creative work is never the bad thing; it is the flattering, seductive lure of the good thing.'
      },
      {
        type: 'paragraph',
        text: 'As your craft matures, the world begins to notice. Invitations arrive: to sit on advisory boards, to speak on podcasts, to write introductory essays for peer publications, and to consult on exciting adjacent projects. Every single one of these invitations is honorable, lucrative, and intellectually engaging.'
      },
      {
        type: 'heading',
        text: 'The Slow Death of the Masterwork'
      },
      {
        type: 'paragraph',
        text: 'And yet, saying yes to five good opportunities is a quiet, cumulative death sentence for the masterwork you were placed here to write. Deep intellectual creation requires unbroken blocks of contemplative solitude—hours where you stare out the window with a coffee cup, waiting for disparate intuitions to crystallize.'
      },
      {
        type: 'quote',
        text: 'A life filled with dozens of good projects leaves zero soil in which greatness can take root.',
        attribution: 'Kabir Mehta'
      },
      {
        type: 'paragraph',
        text: 'To protect your primary calling, you must develop the courage to decline invitations that genuinely honor you. You must say: "This is a wonderful endeavor, and I applaud it from my heart, but my duty lies with this singular book." It feels unnatural and occasionally arrogant, but history remembers only those who protected their sacred focus.'
      },
      {
        type: 'paragraph',
        text: 'Examine your calendar this evening. Identify the three honorable, flattering commitments that are draining your daylight hours away from your true work. Cancel them with grace, and return to the blank page that is waiting for your devotion.'
      }
    ]
  },
  {
    id: 'story-synthetic-dialogue',
    slug: 'when-language-models-reason-in-public',
    title: 'When Language Models Reason in Public',
    subtitle: 'Rethinking rhetoric, ethical discernment, and civic pedagogy in machine-mediated discourse.',
    excerpt: 'Examining what happens to human discourse when conversational neural agents participate in philosophical inquiry.',
    authorId: 'writer-aris',
    topic: 'AI',
    publishedAt: '2026-09-23T08:15:00Z',
    readingTime: '6 min read',
    artworkId: 'portal',
    featured: false,
    previewContent: [
      'Language has always been the primary vehicle through which humans test their moral convictions and refine abstract models of justice.',
      'When autonomous models enter these conversations, we are forced to distinguish between stylistic mimicry of wisdom and authentic moral agency.',
      'This boundary requires new frameworks not only in computer science, but in rhetoric, ethics, and civic pedagogy.'
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Language has always served as humanity’s primary vehicle for testing ethical convictions and refining models of collective justice. From the public squares of classical Athens to the pamphlets of revolutionary Europe, ideas gained validity because real mortal agents stood behind them, risking their reputations and sometimes their lives.'
      },
      {
        type: 'paragraph',
        text: 'When autonomous conversational agents enter public discourse, they challenge our most fundamental assumptions about persuasion. A neural model can generate impeccably reasoned arguments for either side of a moral dilemma without possessing the slightest personal stake in the outcome.'
      },
      {
        type: 'heading',
        text: 'The Seduction of Synthetic Eloquence'
      },
      {
        type: 'paragraph',
        text: 'In classical rhetoric, Aristotle identified three pillars of persuasion: logos (logic), pathos (emotion), and ethos (the moral character of the speaker). Generative models excel at simulating logos and mimicking pathos, but ethos remains utterly beyond their architectural horizon.'
      },
      {
        type: 'quote',
        text: 'Eloquence without moral agency is merely sophisticated acoustics.',
        attribution: 'Dr. Aris Thorne'
      },
      {
        type: 'paragraph',
        text: 'As conversational agents become integrated into newsrooms, legal drafting, and educational tutoring, our task as readers is not to reject the machine out of nostalgic panic, but to train ourselves in deeper hermeneutic discernment:'
      },
      {
        type: 'list',
        items: [
          'Scrutinizing the empirical premises beneath beautifully balanced clauses.',
          'Demanding verifiable citations rather than trusting smooth synthetic tone.',
          'Distinguishing between algorithmic consensus and genuine moral conviction.'
        ]
      },
      {
        type: 'paragraph',
        text: 'The ultimate test of our humanity will not be whether we can build machines that write like philosophers, but whether we can remain discerning readers who remember what truth actually costs.'
      }
    ]
  },
  {
    id: 'story-make-room-idea',
    slug: 'make-room-for-your-next-idea',
    title: 'Make Room for Your Next Idea',
    subtitle: 'Why true creative breakthroughs demand clearing mental clutter before the first stroke of ink.',
    excerpt: 'Why true creative breakthroughs demand clearing the mental clutter before the first stroke of ink.',
    authorId: 'writer-riya',
    topic: 'Personal Growth',
    publishedAt: '2026-10-06T12:00:00Z',
    readingTime: '4 min read',
    artworkId: 'book-lavender',
    featured: false,
    previewContent: [
      'We often imagine creative insight as an electrical strike—instantaneous, blinding, and unbidden. Yet in practice, ideas behave more like shy forest creatures. They only emerge when the surrounding woods are quiet enough to hear their arrival.',
      'In our haste to produce, we fill every spare interval with noise: notifications, secondary analyses, and the reflexive impulse to consume another person’s thoughts before we have digested our own.',
      'Making room is not an act of surrender; it is deliberate architecture. When you step away from the desk and let a thought wander across an unhurried afternoon, the subconscious begins its unglamorous, brilliant assembly work.',
      'The next time you find yourself stuck, resist the urge to search for answers outwards. Close the tabs. Take a slow walk down a street you rarely visit. The idea you have been chasing is already waiting for the silence.'
    ],
    content: [
      {
        type: 'paragraph',
        text: 'We often imagine creative insight as an electrical strike—instantaneous, blinding, and unbidden. Yet in practice, ideas behave more like shy forest creatures. They only emerge when the surrounding woods are quiet enough to hear their arrival.'
      },
      {
        type: 'paragraph',
        text: 'In our haste to produce, we fill every spare interval with noise: notifications, secondary analyses, and the reflexive impulse to consume another person’s thoughts before we have digested our own.'
      },
      {
        type: 'heading',
        text: 'The Architecture of the Pause'
      },
      {
        type: 'paragraph',
        text: 'Making room is not an act of surrender; it is deliberate architecture. When you step away from the desk and let a thought wander across an unhurried afternoon, the subconscious begins its unglamorous, brilliant assembly work.'
      },
      {
        type: 'quote',
        text: 'The idea you have been chasing is not lost in a search engine; it is waiting for your mind to become quiet.',
        attribution: 'Riya Sen'
      },
      {
        type: 'paragraph',
        text: 'The next time you find yourself stuck, resist the urge to search for answers outwards. Close the tabs. Take a slow walk down a street you rarely visit. Give your thoughts room to breathe.'
      }
    ]
  },
  {
    id: 'story-small-beginnings',
    slug: 'small-beginnings-remarkable-possibilities',
    title: 'Small Beginnings: Remarkable Possibilities',
    subtitle: 'How towering cathedrals of thought begin with a single notebook observation.',
    excerpt: 'The enduring structures of literature and science rarely begin with grand proclamations. They begin with a single notebook line.',
    authorId: 'writer-aanya',
    topic: 'Culture',
    publishedAt: '2026-10-06T10:00:00Z',
    readingTime: '5 min read',
    artworkId: 'architectural',
    featured: false,
    previewContent: [
      'Every cathedral of thought begins as a pile of uncarved stones. When we examine monumental achievements in hindsight, we fall victim to a retrospective illusion: we assume the creators always possessed the complete blueprint.',
      'They rarely did. What separated them from the rest was not prophetic certainty, but the courage to tend to a fragile, imperfect seed.',
      'When Joan Didion began writing, she did not start with overarching sociological critiques; she noted the damp odor of eucalyptus and the exact tilt of late afternoon shadows over Sacramento.',
      'Honor your smallest drafts. That half-sentence scrawled on a train ticket or that unfinished observation in your notes app may not look like much today, but it holds the blueprint for everything that follows.'
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Every cathedral of thought begins as a pile of uncarved stones. When we examine monumental achievements in hindsight, we fall victim to a retrospective illusion: we assume the creators always possessed the complete blueprint.'
      },
      {
        type: 'paragraph',
        text: 'They rarely did. What separated them from the rest was not prophetic certainty, but the courage to tend to a fragile, imperfect seed.'
      },
      {
        type: 'heading',
        text: 'The Specificity of the First Line'
      },
      {
        type: 'paragraph',
        text: 'When Joan Didion began writing, she did not start with overarching sociological critiques; she noted the damp odor of eucalyptus and the exact tilt of late afternoon shadows over Sacramento.'
      },
      {
        type: 'quote',
        text: 'Big ideas are anchored to small physical details.',
        attribution: 'Aanya Sharma'
      },
      {
        type: 'paragraph',
        text: 'Honor your smallest drafts. That half-sentence scrawled on a train ticket or that unfinished observation in your notes app may not look like much today, but it holds the blueprint for everything that follows.'
      }
    ]
  }
];

export const COMMUNITY_PICKS = [
  {
    id: 'story-cathedrals-silicon',
    title: 'The Cathedrals of Silicon',
    authorName: 'Devendra Patel',
    readingTime: '6 min read',
    slug: 'cathedrals-of-silicon'
  },
  {
    id: 'story-typography-silence',
    title: 'The Typography of Silence',
    authorName: 'Maya Lindqvist',
    readingTime: '4 min read',
    slug: 'typography-of-silence'
  },
  {
    id: 'story-beauty-of-attention',
    title: 'The Beauty of Paying Attention',
    authorName: 'Kabir Mehta',
    readingTime: '5 min read',
    slug: 'beauty-of-paying-attention'
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

/**
 * Retrieves a single hydrated story by its unique slug
 */
export function getStoryBySlug(slug) {
  if (!slug) return null;
  const rawStory = STORIES.find((s) => s.slug === slug.trim().toLowerCase());
  if (!rawStory) return null;
  return hydrateStory(rawStory);
}

/**
 * Retrieves 3 related stories for the current reading context.
 * Selection priority:
 * 1. Same topic, excluding current story.
 * 2. Shared author, excluding current story.
 * 3. Latest curated fallback stories.
 */
export function getRelatedStories(currentStoryId, topic, authorId, limit = 3) {
  const allHydrated = getAllHydratedStories();
  const candidates = allHydrated.filter((s) => s.id !== currentStoryId);

  // 1. Same topic
  const sameTopic = candidates.filter((s) => s.topic === topic);

  // 2. Same author (if not already in sameTopic)
  const sameAuthor = candidates.filter((s) => s.authorId === authorId && !sameTopic.some((t) => t.id === s.id));

  // 3. Fallback other stories
  const others = candidates.filter((s) => !sameTopic.some((t) => t.id === s.id) && !sameAuthor.some((a) => a.id === s.id));

  const combined = [...sameTopic, ...sameAuthor, ...others];
  return combined.slice(0, limit);
}
