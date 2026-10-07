import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TopicChip from '../components/ui/TopicChip';
import { PrimaryButton, TextButton } from '../components/ui/Button';
import { InlineMessage } from '../components/ui/InlineMessage';
import { EditorialAsterisk } from '../components/editorial/EditorialDecorations';

const AVAILABLE_TOPICS = [
  'Technology',
  'Design',
  'AI',
  'Culture',
  'Personal Growth',
  'Writing',
  'Science',
  'Philosophy'
];

export default function OnboardingPage({ onNavigate }) {
  const { user, completeOnboarding } = useAuth();
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleTopic = (topic) => {
    setErrorMessage('');
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleComplete = () => {
    if (selectedTopics.length < 2) {
      setErrorMessage('Please pick at least 2 topics so we can shape your reading feed.');
      return;
    }

    setIsLoading(true);
    completeOnboarding(selectedTopics);
    setIsLoading(false);
    onNavigate('/community');
  };

  const handleSkip = () => {
    setIsLoading(true);
    // Provide sensible default interest set
    completeOnboarding(['Technology', 'Design', 'AI']);
    setIsLoading(false);
    onNavigate('/community');
  };

  return (
    <div className="quill-onboarding-shell">
      <header style={{ maxWidth: '680px', margin: '0 auto var(--space-6)', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="brand-wordmark" style={{ color: 'var(--color-text-inverse, #1E1C1A)' }}>
          quill<span style={{ color: 'var(--color-accent)' }}>.</span>
        </span>
        <span className="text-meta" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
          <span>Step 1 of 1</span>
          <EditorialAsterisk size={12} color="var(--color-accent)" />
        </span>
      </header>

      <main className="quill-onboarding-card">
        <span className="text-eyebrow" style={{ color: 'var(--color-accent)' }}>ONE SMALL STEP</span>
        <h1
          className="font-serif text-h1"
          style={{ color: 'var(--color-text-inverse, #1E1C1A)', marginTop: 'var(--space-2)', marginBottom: 'var(--space-2)' }}
        >
          What pulls you in?
        </h1>
        <p className="text-body" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
          Pick a few topics and we’ll shape your first reading room around them.
        </p>

        {errorMessage && (
          <InlineMessage type="warning" className="mb-4">
            {errorMessage}
          </InlineMessage>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
          <span className="text-meta" style={{ fontWeight: 600 }}>Available Topics</span>
          <span className="text-meta" style={{ color: selectedTopics.length >= 2 ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
            {selectedTopics.length} of {AVAILABLE_TOPICS.length} selected (minimum 2)
          </span>
        </div>

        <div className="quill-onboarding-grid" role="group" aria-label="Reading interest options">
          {AVAILABLE_TOPICS.map((topic) => {
            const isSelected = selectedTopics.includes(topic);
            return (
              <TopicChip
                key={topic}
                label={topic}
                selected={isSelected}
                onClick={() => toggleTopic(topic)}
              />
            );
          })}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'var(--space-8)',
            paddingTop: 'var(--space-6)',
            borderTop: '1px solid rgba(30, 28, 26, 0.1)',
            flexWrap: 'wrap',
            gap: 'var(--space-4)'
          }}
        >
          <TextButton onClick={handleSkip} disabled={isLoading}>
            I’ll choose later →
          </TextButton>

          <PrimaryButton
            onClick={handleComplete}
            loading={isLoading}
            disabled={selectedTopics.length < 2}
          >
            Enter your reading room
          </PrimaryButton>
        </div>
      </main>
    </div>
  );
}
