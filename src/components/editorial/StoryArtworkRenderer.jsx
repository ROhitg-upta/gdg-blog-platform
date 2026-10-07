import React from 'react';
import {
  ArtworkLavenderBook,
  ArtworkArchitecturalPeach,
  ArtworkSunlitCorner
} from '../ArtworkIllustrations';
import {
  ArtworkGeometricManuscript,
  ArtworkArchitecturalPortal,
  ArtworkAlgorithmicParchment
} from './EditorialArtwork';

export default function StoryArtworkRenderer({ artworkId = 'book-lavender', className = '' }) {
  switch (artworkId) {
    case 'book-lavender':
      return <ArtworkLavenderBook />;
    case 'architectural':
    case 'architectural-peach':
      return <ArtworkArchitecturalPeach />;
    case 'sunlit':
    case 'sunlit-corner':
      return <ArtworkSunlitCorner />;
    case 'geometric':
      return <ArtworkGeometricManuscript className={className} />;
    case 'portal':
      return <ArtworkArchitecturalPortal className={className} />;
    case 'algorithmic':
    case 'parchment':
      return <ArtworkAlgorithmicParchment className={className} />;
    default:
      return <ArtworkLavenderBook />;
  }
}
