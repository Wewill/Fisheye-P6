// src/types/index.d.ts
export * from './Photographer';
export * from './Media';

export interface Data {
    photographers: Photographer[];
    media: Media[];
}