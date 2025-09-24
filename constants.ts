import type { SelectOption } from './types';

export const WORD_COUNT_OPTIONS: SelectOption[] = [
  { value: '300', label: 'Approx. 300 words' },
  { value: '500', label: 'Approx. 500 words' },
  { value: '1000', label: 'Approx. 1000 words' },
  { value: '2000', label: 'Approx. 2000 words' },
  { value: '3000', label: 'Approx. 3000 words' },
  { value: 'custom', label: 'Custom...' },
];

export const LANGUAGE_OPTIONS: SelectOption[] = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Hindi-English Mix', label: 'Hindi-English Mix' },
];

export const TONE_OPTIONS: SelectOption[] = [
  { value: 'Professional', label: 'Professional' },
  { value: 'Formal', label: 'Formal' },
  { value: 'Friendly', label: 'Friendly' },
  { value: 'Motivational', label: 'Motivational' },
  { value: 'Human touch', label: 'Human touch' },
];

export const ASPECT_RATIO_OPTIONS: SelectOption[] = [
    { value: '16:9', label: '16:9 (Landscape)' },
    { value: '1:1', label: '1:1 (Square)' },
    { value: '9:16', label: '9:16 (Portrait)' },
    { value: '4:3', label: '4:3 (Standard)' },
    { value: '3:4', label: '3:4 (Tall)' },
];