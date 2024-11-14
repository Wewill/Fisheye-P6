// src/types/index.ts
import {Photographer} from './photographer';
import {Media} from './media';

export interface Data {
    photographers: Photographer[];
    media: Media[];
}