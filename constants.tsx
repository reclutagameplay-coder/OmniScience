import React from 'react';
import { Subject, SubjectConfig } from './types';

export const SUBJECT_CONFIGS: Record<Subject, SubjectConfig> = {
  [Subject.MATH]: {
    id: Subject.MATH,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    gradient: 'from-blue-600 to-cyan-500',
    icon: '📐',
  },
  [Subject.PHYSICS]: {
    id: Subject.PHYSICS,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    gradient: 'from-purple-600 to-pink-500',
    icon: '⚡',
  },
  [Subject.CHEMISTRY]: {
    id: Subject.CHEMISTRY,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    gradient: 'from-emerald-600 to-lime-500',
    icon: '🧪',
  },
};

export const LoadingSpinner = () => (
  <div className="flex space-x-1 justify-center items-center h-6">
    <div className="w-2 h-2 bg-white rounded-full typing-dot"></div>
    <div className="w-2 h-2 bg-white rounded-full typing-dot"></div>
    <div className="w-2 h-2 bg-white rounded-full typing-dot"></div>
  </div>
);
