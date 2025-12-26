
export enum ArtStyle {
  CLASSIC_COMIC = 'Classic Comic Book',
  ANIME_MANGA = 'Vibrant Anime/Manga',
  PIXAR_3D = '3D Animation Movie',
  POP_ART = 'Lichtenstein Pop Art',
  CYBERPUNK = 'Neon Cyberpunk Toon',
  WATERCOLOR = 'Artistic Watercolor Illustration',
  SKETCH = 'Hand-drawn Charcoal Sketch'
}

export interface StyleOption {
  id: ArtStyle;
  name: string;
  description: string;
  previewUrl: string;
  prompt: string;
}

export interface Artist {
  name: string;
  specialty: string;
}

export interface TransformationResult {
  originalUrl: string;
  transformedUrl: string;
  style: ArtStyle | string;
  influences: string[];
}
