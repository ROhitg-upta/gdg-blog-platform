import React, { useState } from 'react';
import AppShell from '../layouts/AppShell';
import { PageContainer } from '../layouts/DashboardLayout';
import { PrimaryButton, SecondaryButton, GhostButton, TextButton } from '../components/ui/Button';
import IconButton from '../components/ui/IconButton';
import FormField from '../components/ui/FormField';
import { TextInput, SearchInput, PasswordInput, TextArea } from '../components/ui/Input';
import { SelectField } from '../components/ui/Select';
import { Menu, MenuItem, MenuDivider } from '../components/ui/Menu';
import TopicChip from '../components/ui/TopicChip';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { Toast, ToastContainer } from '../components/ui/Toast';
import { SkeletonText, SkeletonAvatar, SkeletonStoryCard } from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import { ErrorState, InlineMessage } from '../components/ui/InlineMessage';
import { SidebarNavItem, SectionLabel, TabList, TabButton } from '../components/navigation/NavigationPrimitives';
import StoryMeta from '../components/editorial/StoryMeta';
import FeedStoryItem from '../components/editorial/FeedStoryItem';
import { FeaturedStoryCard, CompactStoryLink } from '../components/editorial/FeaturedStoryCard';
import {
  ArtworkGeometricManuscript,
  ArtworkArchitecturalPortal,
  ArtworkAlgorithmicParchment
} from '../components/editorial/EditorialArtwork';
import {
  EditorialAsterisk,
  HandDrawnUnderline,
  DottedArc,
  SmallArrow
} from '../components/editorial/EditorialDecorations';

/**
 * INTERNAL COMPONENT SHOWCASE / DESIGN SYSTEM PREVIEW
 * Route: /design-system
 * NOTE: This is an internal engineering preview for testing tokens, layouts,
 * and components during Module 1. It is not an end-user page.
 */
export default function DesignSystemPreview({ onBackToApp }) {
  // State for interactive component demos
  const [searchValue, setSearchValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('quill-editorial-token');
  const [textValue, setTextValue] = useState('Drafting an essay on architecture...');
  const [selectedTopic, setSelectedTopic] = useState('Design');
  const [activeTab, setActiveTab] = useState('for-you');
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Trigger loading demo
  const handleLoadingDemo = () => {
    setIsBtnLoading(true);
    setTimeout(() => setIsBtnLoading(false), 1600);
  };

  // Toast trigger demo
  const triggerToast = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const sampleStory = {
    id: 's-1',
    title: 'Small beginnings. Remarkable possibilities.',
    excerpt: 'The enduring structures of literature and architectural design rarely begin with grand proclamations. They begin with an unhurried line.',
    author: { name: 'Aanya Sharma', avatar: '' },
    date: 'Oct 6',
    topic: 'Design',
    readingTime: '6 min read'
  };

  return (
    <AppShell>
      <PageContainer style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-16)' }}>
        {/* Internal Header Notice */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span className="text-eyebrow">MODULE 1 VERIFICATION</span>
              <EditorialAsterisk size={14} color="var(--color-accent)" />
            </div>
            <h1 className="text-h1 font-serif" style={{ marginTop: 'var(--space-1)' }}>
              Quill Design System Foundation
            </h1>
            <p className="text-meta" style={{ marginTop: 'var(--space-1)' }}>
              Centralized tokens, accessible UI primitives, and editorial components in dark Quill shell.
            </p>
          </div>

          {onBackToApp && (
            <SecondaryButton onClick={onBackToApp}>
              ← Return to Application
            </SecondaryButton>
          )}
        </div>

        {/* 1. FOUNDATIONS & COLOR ROLES */}
        <section style={{ marginBottom: 'var(--space-10)' }}>
          <SectionLabel>1. Foundations & Token Palette</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
            <div className="quill-surface-card" style={{ borderLeft: '4px solid var(--color-ink-elevated)' }}>
              <span className="text-meta">Core Shell</span>
              <p className="text-body" style={{ fontWeight: 600 }}>Ink Shell (#141310)</p>
            </div>
            <div className="quill-surface-card" style={{ borderLeft: '4px solid var(--color-text-primary)' }}>
              <span className="text-meta">Primary Text</span>
              <p className="text-body" style={{ fontWeight: 600 }}>Warm Ivory (#F5F0E6)</p>
            </div>
            <div className="quill-surface-card" style={{ borderLeft: '4px solid var(--color-accent)' }}>
              <span className="text-meta">Primary Accent</span>
              <p className="text-body" style={{ fontWeight: 600, color: 'var(--color-accent)' }}>Emerald (#35B84B)</p>
            </div>
            <div className="quill-surface-card" style={{ borderLeft: '4px solid var(--color-border-strong)' }}>
              <span className="text-meta">Hairline Divider</span>
              <p className="text-body" style={{ fontWeight: 600 }}>Border Subtle (12% alpha)</p>
            </div>
          </div>
        </section>

        {/* 2. BUTTON SYSTEM */}
        <section style={{ marginBottom: 'var(--space-10)' }}>
          <SectionLabel>2. Button System & States</SectionLabel>
          <div className="quill-surface-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-3)' }}>
            <PrimaryButton onClick={handleLoadingDemo} loading={isBtnLoading}>
              Primary Action (Click for loading)
            </PrimaryButton>

            <SecondaryButton onClick={() => triggerToast('info', 'Secondary action clicked')}>
              Secondary Outline
            </SecondaryButton>

            <GhostButton onClick={() => triggerToast('info', 'Ghost action triggered')}>
              Ghost Button
            </GhostButton>

            <TextButton onClick={() => triggerToast('info', 'Inline text action')}>
              Inline Link Action →
            </TextButton>

            <IconButton
              label="Bookmarks"
              tooltip="Bookmark action"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              }
              onClick={() => triggerToast('success', 'Bookmark clicked')}
            />
          </div>
        </section>

        {/* 3. FORM FIELDS */}
        <section style={{ marginBottom: 'var(--space-10)' }}>
          <SectionLabel>3. Form Fields & Interactive Controls</SectionLabel>
          <div className="quill-surface-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-3)' }}>
            <FormField id="demo-search" label="Search Stories (Try typing & clearing)">
              <SearchInput
                id="demo-search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue('')}
              />
            </FormField>

            <FormField id="demo-password" label="Password with Visibility Toggle">
              <PasswordInput
                id="demo-password"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
              />
            </FormField>

            <FormField id="demo-text" label="Standard Text Field" helperText="Maximum 100 characters">
              <TextInput
                id="demo-text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
              />
            </FormField>

            <FormField id="demo-select" label="Select Topic Category">
              <SelectField
                id="demo-select"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                options={[
                  { value: 'Technology', label: 'Technology' },
                  { value: 'Design', label: 'Design' },
                  { value: 'Artificial Intelligence', label: 'Artificial Intelligence' },
                  { value: 'Personal Growth', label: 'Personal Growth' }
                ]}
              />
            </FormField>

            <div style={{ gridColumn: '1 / -1' }}>
              <FormField id="demo-textarea" label="Multi-line Text Area">
                <TextArea
                  id="demo-textarea"
                  placeholder="Tell your story..."
                  rows={3}
                />
              </FormField>
            </div>
          </div>
        </section>

        {/* 4. CHIPS, AVATARS & NAVIGATION */}
        <section style={{ marginBottom: 'var(--space-10)' }}>
          <SectionLabel>4. Chips, Avatars & Navigation Primitives</SectionLabel>
          <div className="quill-surface-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', marginTop: 'var(--space-3)' }}>
            <div>
              <p className="text-meta" style={{ marginBottom: 'var(--space-2)' }}>Selectable Topic Chips (Keyboard accessible):</p>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {['Technology', 'Design', 'Artificial Intelligence', 'Philosophy'].map((topic) => (
                  <TopicChip
                    key={topic}
                    label={topic}
                    selected={selectedTopic === topic}
                    onClick={() => setSelectedTopic(topic)}
                    count={topic === 'Design' ? 14 : 8}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-meta" style={{ marginBottom: 'var(--space-2)' }}>Avatar System (Initials fallback & sizes):</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <Avatar name="Alex Vance" size="lg" />
                <Avatar name="Riya Sen" size="md" />
                <Avatar name="Kabir Mehta" size="sm" />
                <Avatar name="Aanya" size="xs" />
              </div>
            </div>

            <div>
              <p className="text-meta" style={{ marginBottom: 'var(--space-2)' }}>Tab Bar with Emerald Indicator:</p>
              <TabList>
                <TabButton id="tab-foryou" label="For you" active={activeTab === 'for-you'} onClick={() => setActiveTab('for-you')} />
                <TabButton id="tab-following" label="Following" active={activeTab === 'following'} onClick={() => setActiveTab('following')} />
                <TabButton id="tab-latest" label="Latest" active={activeTab === 'latest'} onClick={() => setActiveTab('latest')} />
              </TabList>
            </div>
          </div>
        </section>

        {/* 5. EDITORIAL STORY COMPONENTS */}
        <section style={{ marginBottom: 'var(--space-10)' }}>
          <SectionLabel>5. Story Components & Local Artwork</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-3)' }}>
            {/* Feed Story Item */}
            <div className="quill-surface-card">
              <span className="text-meta">FeedStoryItem (Horizontal Feed Format)</span>
              <FeedStoryItem
                story={sampleStory}
                artwork={<ArtworkGeometricManuscript />}
                isBookmarked={isBookmarked}
                onBookmarkClick={() => {
                  setIsBookmarked(!isBookmarked);
                  triggerToast('success', isBookmarked ? 'Bookmark removed' : 'Saved to bookmarks');
                }}
                onStoryClick={() => triggerToast('info', 'Story detail opened')}
              />
            </div>

            {/* Featured Story Card */}
            <div>
              <FeaturedStoryCard
                story={{
                  ...sampleStory,
                  title: 'The Architecture of Thought'
                }}
                artwork={<ArtworkArchitecturalPortal />}
                action={
                  <PrimaryButton onClick={() => triggerToast('info', 'Reading featured story')}>
                    Read full essay <SmallArrow color="#071A0B" />
                  </PrimaryButton>
                }
              />
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-6)', maxWidth: '340px' }}>
            <span className="text-meta">CompactStoryLink (Community Picks format):</span>
            <CompactStoryLink
              index={1}
              story={sampleStory}
              onStoryClick={() => triggerToast('info', 'Compact link clicked')}
            />
            <CompactStoryLink
              index={2}
              story={{ title: 'Analog Roots of Digital Memory', author: { name: 'Pooja K.' } }}
              onStoryClick={() => triggerToast('info', 'Compact link clicked')}
            />
          </div>
        </section>

        {/* 6. FEEDBACK & OVERLAYS */}
        <section style={{ marginBottom: 'var(--space-10)' }}>
          <SectionLabel>6. Feedback, Modals & Loading Skeletons</SectionLabel>
          <div className="quill-surface-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', marginTop: 'var(--space-3)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <PrimaryButton onClick={() => setIsModalOpen(true)}>
                Open Accessible Modal
              </PrimaryButton>

              <SecondaryButton onClick={() => setIsConfirmOpen(true)}>
                Open Confirm Dialog
              </SecondaryButton>

              <SecondaryButton onClick={() => triggerToast('success', 'Changes saved to draft successfully')}>
                Trigger Success Toast
              </SecondaryButton>

              <SecondaryButton onClick={() => triggerToast('error', 'Connection interrupted')}>
                Trigger Error Toast
              </SecondaryButton>
            </div>

            <div>
              <p className="text-meta" style={{ marginBottom: 'var(--space-2)' }}>Inline Feedback Banners:</p>
              <InlineMessage type="success">
                Your draft has been autosaved to local memory.
              </InlineMessage>
              <InlineMessage type="warning">
                Unsaved changes detected in the editor canvas.
              </InlineMessage>
              <InlineMessage type="error">
                Unable to save: Title must be at least 5 characters.
              </InlineMessage>
            </div>

            <div>
              <p className="text-meta" style={{ marginBottom: 'var(--space-2)' }}>Reduced-Motion Safe Loading Skeletons:</p>
              <SkeletonStoryCard />
            </div>

            <div>
              <p className="text-meta" style={{ marginBottom: 'var(--space-2)' }}>Zero-Data Empty State:</p>
              <EmptyState
                title="Your reading shelf is clear"
                description="Save stories while browsing the community feed to build your personal library."
                action={
                  <SecondaryButton onClick={() => triggerToast('info', 'Browsing feed')}>
                    Explore community stories
                  </SecondaryButton>
                }
              />
            </div>
          </div>
        </section>

        {/* 7. DECORATIVE ELEMENTS */}
        <section>
          <SectionLabel>7. Editorial Vector Decorations</SectionLabel>
          <div className="quill-surface-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', marginTop: 'var(--space-3)' }}>
            <div style={{ textAlign: 'center' }}>
              <EditorialAsterisk size={28} color="var(--color-accent)" />
              <p className="text-meta">Asterisk</p>
            </div>
            <div style={{ textAlign: 'center', width: '140px' }}>
              <HandDrawnUnderline color="var(--color-accent)" />
              <p className="text-meta">Organic Underline</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <DottedArc size={48} color="var(--color-text-muted)" />
              <p className="text-meta">Dotted Arc</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <SmallArrow color="var(--color-accent)" />
              <p className="text-meta">Small Arrow</p>
            </div>
          </div>
        </section>

        {/* Interactive Modal Instances */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Editorial Reading Preview"
          description="This dialog traps focus, locks background scrolling, and closes seamlessly on Escape key."
        >
          <p className="text-body" style={{ marginBottom: 'var(--space-4)' }}>
            All Quill overlay dialogs comply with WAI-ARIA modal dialog accessibility patterns. Focus is restored to the triggering element upon exit.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
            <PrimaryButton onClick={() => setIsModalOpen(false)}>
              Understood
            </PrimaryButton>
          </div>
        </Modal>

        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={() => {
            setIsConfirmOpen(false);
            triggerToast('error', 'Story draft discarded');
          }}
          destructive={true}
          title="Delete draft story?"
          description="Are you sure you want to discard this draft? This action cannot be reversed."
          confirmLabel="Delete Draft"
          cancelLabel="Keep Writing"
        />

        {/* Active Toast Notifications */}
        <ToastContainer>
          {toasts.map((t) => (
            <Toast
              key={t.id}
              type={t.type}
              message={t.message}
              onDismiss={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
            />
          ))}
        </ToastContainer>
      </PageContainer>
    </AppShell>
  );
}
