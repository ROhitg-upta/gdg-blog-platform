/**
 * ============================================================================
 * QUILL CURATED THEMED COLLECTIONS
 * Editorial collections that group essays by enduring philosophical and craft themes.
 * ============================================================================
 */

export const CURATED_COLLECTIONS = [
  {
    slug: 'building-things',
    title: 'For people building things',
    subtitle: 'Craft, software architecture, and systems meant to endure.',
    description: 'A gathering of essays on the dignity of engineering, architectural discipline, and resisting the urge to discard durable foundations for transient hype.',
    curatorNote: 'Curated for engineers, system architects, and designers seeking enduring leverage over fleeting novelty.',
    artworkId: 'architectural',
    accentBg: '#E8DED1',
    accentColor: '#5C381E',
    storyIds: [
      'story-cathedrals-silicon',
      'story-attention-architectures',
      'story-generative-pause'
    ]
  },
  {
    slug: 'slower-internet',
    title: 'A slower internet',
    subtitle: 'Digital minimalism, silence, and tactile human culture.',
    description: 'Writings exploring the quiet power of physical notebooks, deliberate communication, and decoupling creative expression from real-time algorithm feeds.',
    curatorNote: 'Selected for contemplative readers seeking mental quietude away from hyper-reactive timelines.',
    artworkId: 'silence',
    accentBg: '#DCE3CC',
    accentColor: '#344E26',
    storyIds: [
      'story-tactile-manuscript',
      'story-silence-margins',
      'story-mindful-walking'
    ]
  },
  {
    slug: 'ideas-revisiting',
    title: 'Ideas worth revisiting',
    subtitle: 'Enduring thoughts and foundational design philosophies.',
    description: 'Timeless observations that grow richer on second and third readings. Concepts that anchor creative work through changing technological seasons.',
    curatorNote: 'Essays that reward slow re-reading and marginal annotation.',
    artworkId: 'minimal',
    accentBg: '#DDD5EA',
    accentColor: '#43346B',
    storyIds: [
      'story-silence-margins',
      'story-cathedrals-silicon',
      'story-attention-architectures'
    ]
  },
  {
    slug: 'better-attention',
    title: 'Designing better attention',
    subtitle: 'Intentional tools, cognitive hygiene, and focus.',
    description: 'How modern interfaces shape our mental horizons, and what it takes to construct software that protects cognitive depth rather than fragmenting it.',
    curatorNote: 'Reflections from cognitive scientists and interface thinkers.',
    artworkId: 'nature',
    accentBg: '#F0D1BB',
    accentColor: '#6B3C18',
    storyIds: [
      'story-attention-architectures',
      'story-mindful-walking',
      'story-generative-pause'
    ]
  },
  {
    slug: 'small-beginnings',
    title: 'Small beginnings',
    subtitle: 'First drafts, early observations, and quiet momentum.',
    description: 'The beauty of starting without grand expectations. Why gentle persistence and honest observation outpace sudden bursts of performative intensity.',
    curatorNote: 'Encouragement for writers, craftspeople, and creators embarking on unfamiliar paths.',
    artworkId: 'portal',
    accentBg: '#F5DCD2',
    accentColor: '#6E3224',
    storyIds: [
      'story-tactile-manuscript',
      'story-mindful-walking',
      'story-silence-margins'
    ]
  }
];

export function getCollectionBySlug(slug) {
  if (!slug) return null;
  return CURATED_COLLECTIONS.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) || null;
}
