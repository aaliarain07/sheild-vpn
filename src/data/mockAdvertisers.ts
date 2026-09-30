/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MockAdvertiser {
  id: string;
  name: string;
  category: string;
  headline: string;
  description: string;
  ctaText: string;
  rating: number;
  reviewsCount: string;
  iconBg: string;
  iconColor: string;
  badgeColor: string;
  type: 'productivity' | 'game' | 'food' | 'fitness' | 'language';
}

export const MOCK_ADVERTISERS: MockAdvertiser[] = [
  {
    id: 'taskflow',
    name: 'TaskFlow Pro',
    category: 'Productivity & Habits',
    headline: 'Organize thoughts, automate daily work',
    description: 'Smart daily planning with sub-tasks, calendar synchronization, and zero clutter.',
    ctaText: 'Install Free',
    rating: 4.8,
    reviewsCount: '124K',
    iconBg: 'bg-indigo-600',
    iconColor: 'text-indigo-200',
    badgeColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    type: 'productivity',
  },
  {
    id: 'luminablocks',
    name: 'Lumina Blocks',
    category: 'Brain Puzzle Quest',
    headline: '1,000+ relaxing spatial color puzzles',
    description: 'No timers or stress. Clean geometric mechanics and soothing spatial audio.',
    ctaText: 'Play Now',
    rating: 4.9,
    reviewsCount: '89K',
    iconBg: 'bg-purple-600',
    iconColor: 'text-purple-200',
    badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    type: 'game',
  },
  {
    id: 'quickbite',
    name: 'QuickBite Fresh',
    category: 'Food Delivery',
    headline: 'Hot meals to your door in 20 minutes',
    description: 'Order from 600+ curated artisan kitchens. Zero delivery fee on your first 3 orders.',
    ctaText: 'Order Now',
    rating: 4.7,
    reviewsCount: '210K',
    iconBg: 'bg-emerald-600',
    iconColor: 'text-emerald-200',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    type: 'food',
  },
  {
    id: 'pulsefit',
    name: 'PulseFit 15',
    category: 'Health & Fitness',
    headline: '15-minute home workouts that work',
    description: 'Guided bodyweight and dumbbell circuits created by Olympic athletic coaches.',
    ctaText: 'Start Free',
    rating: 4.8,
    reviewsCount: '95K',
    iconBg: 'bg-amber-600',
    iconColor: 'text-amber-200',
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    type: 'fitness',
  },
  {
    id: 'linguasphere',
    name: 'LinguaSphere',
    category: 'Language Learning',
    headline: 'Speak a new language with confidence',
    description: 'Interactive conversational immersion and AI pronunciation correction in 10 mins/day.',
    ctaText: 'Try Free',
    rating: 4.9,
    reviewsCount: '150K',
    iconBg: 'bg-cyan-600',
    iconColor: 'text-cyan-200',
    badgeColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    type: 'language',
  },
];
