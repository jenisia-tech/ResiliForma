import React, { useState } from 'react';
import type { RecommendationItem, RecommendationCategory } from '../types';
import { RecommendationCard } from '../components/RecommendationCard';

interface RecommendationsProps {
  recommendations: RecommendationItem[];
  onApplyRecommendation: (id: string) => void;
}

export const Recommendations: React.FC<RecommendationsProps> = ({
  recommendations,
  onApplyRecommendation
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  const categories: (string | RecommendationCategory)[] = [
    'All',
    'Acoustic',
    'Solar',
    'Hydrology',
    'Accessibility',
    'Urban Design',
    'Rural Planning'
  ];

  const filtered = recommendations.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesPriority = selectedPriority === 'All' || item.priority === selectedPriority;
    return matchesCategory && matchesPriority;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="rf-badge rf-badge-cyan">AI Planning Copilot</span>
            <span className="rf-badge rf-badge-muted">{recommendations.length} Action Items</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', margin: 0 }}>Climate-Adaptive Recommendations</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Curated engineering and ecological site-planning interventions prioritized by impact.
          </p>
        </div>

        {/* Priority Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Priority:</span>
          <select
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: '#ffffff',
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.78rem',
              outline: 'none'
            }}
          >
            <option value="All">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        marginBottom: '1.5rem'
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rf-btn ${selectedCategory === cat ? 'rf-btn-primary' : 'rf-btn-secondary'}`}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommendations Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {filtered.length > 0 ? (
          filtered.map(rec => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onApply={onApplyRecommendation}
            />
          ))
        ) : (
          <div className="rf-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              No recommendations found for selected category / priority filter.
            </div>
            <button
              onClick={() => { setSelectedCategory('All'); setSelectedPriority('All'); }}
              className="rf-btn rf-btn-secondary"
              style={{ fontSize: '0.75rem' }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
