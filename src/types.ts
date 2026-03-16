/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  type: 'audio' | 'video';
  lyrics?: LyricLine[];
  thumbnail?: string;
}

export interface AIModelConfig {
  id: string;
  name: string;
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
  description: string;
}

export type TabType = 'explorer' | 'ai-config' | 'player';
