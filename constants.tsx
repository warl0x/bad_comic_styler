
import { ArtStyle, StyleOption, Artist } from './types';

export const ART_STYLES: StyleOption[] = [
  {
    id: ArtStyle.CLASSIC_COMIC,
    name: 'Classic Comic',
    description: 'Bold outlines, high contrast, and retro Ben-Day dots.',
    previewUrl: 'https://picsum.photos/seed/comic/400/400',
    prompt: 'Transform this photo into a highly stylized classic 1960s comic book illustration. Use heavy, thick black ink outlines and vibrant, non-realistic primary colors. This must look like hand-drawn art on paper, completely avoiding any photographic realism.'
  },
  {
    id: ArtStyle.PIXAR_3D,
    name: '3D Animation',
    description: 'Modern 3D movie look with soft lighting.',
    previewUrl: 'https://picsum.photos/seed/pixar/400/400',
    prompt: 'Convert this image into a stylized 3D animated movie character. Use expressive, exaggerated features and smooth, simplified textures. It should look like a character from a high-end animation studio, not a realistic human.'
  },
  {
    id: ArtStyle.ANIME_MANGA,
    name: 'Anime/Manga',
    description: 'Vibrant Japanese animation style.',
    previewUrl: 'https://picsum.photos/seed/anime/400/400',
    prompt: 'Redraw this photo as a vibrant Japanese Anime or Manga illustration. Use sharp cel-shading, stylized linework, and dramatic, non-photorealistic lighting. The final result must be a 2D drawing.'
  }
];

export const ARTISTS: Artist[] = [
  { name: 'Todd McFarlane', specialty: 'Intricate detail, dark atmospheres, flowing capes' },
  { name: 'Jim Lee', specialty: 'Heroic anatomy, dynamic cross-hatching' },
  { name: 'Rob Liefeld', specialty: 'Extreme energy, exaggerated anatomy, many pouches' },
  { name: 'Marc Silvestri', specialty: 'Elegant line work, high-fashion aesthetic' },
  { name: 'Erik Larsen', specialty: 'Golden-age energy, bold muscularity' },
  { name: 'Whilce Portacio', specialty: 'Tech-organic details, gritty textures' },
  { name: 'Jim Valentino', specialty: 'Clean, classic superhero lines' },
  { name: 'Greg Capullo', specialty: 'Gothic energy, expressive faces' },
  { name: 'Stephen Platt', specialty: 'Hyper-detailed rendering' },
  { name: 'J. Scott Campbell', specialty: 'Stylized, elongated figures, clean lines' },
  { name: 'Brett Booth', specialty: 'Hyper-dynamic poses, intricate hatching' },
  { name: 'Sam Kieth', specialty: 'Abstract, exaggerated proportions, surrealism' },
  { name: 'Travis Charest', specialty: 'European-influenced ultra-detail' },
  { name: 'Dale Keown', specialty: 'Massive muscular power, realistic lighting' },
  { name: 'Tony Daniel', specialty: 'Polished, modern DC-style aesthetic' },
  { name: 'Bart Sears', specialty: 'Vast, powerful anatomy' },
  { name: 'Jae Lee', specialty: 'Stylized, silhouette-heavy gothic art' },
  { name: 'Ryan Ottley', specialty: 'High-octane kinetic energy, visceral detail' },
  { name: 'Charlie Adlard', specialty: 'Gritty, realistic charcoal/ink feel' },
  { name: 'Fiona Staples', specialty: 'Clean, digital-paint hybrid, unique palette' },
  { name: 'Jamie McKelvie', specialty: 'Perfect clean-line pop aesthetic' },
  { name: 'Sean Phillips', specialty: 'Gritty noir, heavy shadows' },
  { name: 'Frank Quitely', specialty: 'Unique textural line work, distinct anatomy' },
  { name: 'Jerome Opeña', specialty: 'Atmospheric painterly textures' },
  { name: 'Matteo Scalera', specialty: 'Sharp, angular dynamic movement' },
  { name: 'Wes Craig', specialty: 'Experimental layouts, bold flat colors' },
  { name: 'Rob Guillory', specialty: 'Stylized, cartoonish, expressive energy' },
  { name: 'Dustin Nguyen', specialty: 'Soft watercolor comic style' },
  { name: 'Cliff Chiang', specialty: 'Iconic, graphic design-oriented lines' },
  { name: 'Jock', specialty: 'High-contrast, abstract energy, ink splatters' },
  { name: 'Christian Ward', specialty: 'Psychedelic colors, cosmic energy' },
  { name: 'Skottie Young', specialty: 'Whimsical, baby-variant aesthetic' },
  { name: 'Gabriel Bá', specialty: 'European-infused, rhythmic line work' },
  { name: 'Fábio Moon', specialty: 'Atmospheric, poetic brushstrokes' },
  { name: 'Nick Dragotta', specialty: 'Retro-futuristic, clean Manga influence' },
  { name: 'Greg Tocchini', specialty: 'Abstract, painterly sci-fi art' },
  { name: 'Tula Lotay', specialty: 'Ethereal, layered watercolor/pencil' },
  { name: 'Jason Latour', specialty: 'Punchy, gritty street aesthetic' },
  { name: 'Ryan Stegman', specialty: '90s influence, high detail, sharp lines' },
  { name: 'Cory Walker', specialty: 'Clean, efficiency-driven lines' },
  { name: 'Martin Simmonds', specialty: 'Mixed-media, collage, unsettling noir' },
  { name: 'Daniel Warren Johnson', specialty: 'Hyper-kinetic energy, sound-effect heavy' },
  { name: 'Zoe Thorogood', specialty: 'Raw, emotional, sketchbook style' },
  { name: 'Alvaro Martinez Bueno', specialty: 'Detailed, atmospheric modern horror' },
  { name: 'Sana Takeda', specialty: 'Ornate, detailed digital painting/Manga' },
  { name: 'Elsa Charretier', specialty: 'Classic golden age/Darwin Cooke vibe' },
  { name: 'Sanford Greene', specialty: 'Hip-hop energy, graffiti influenced lines' },
  { name: 'Jakub Rebelka', specialty: 'Detailed, medieval sci-fi hybrid' },
  { name: 'Peach Momoko', specialty: 'Traditional Japanese ink and watercolor' },
  { name: 'Artyom Topilin', specialty: 'Gritty, textured indie aesthetic' },
  { name: 'Jason Shawn Alexander', specialty: 'Dark, expressive, ink-heavy realism' }
];

export const LOADING_MESSAGES = [
  "Mixing the ink...",
  "Blending the palettes...",
  "Studying the pencil work...",
  "Applying legendary cross-hatching...",
  "Summoning the art gods...",
  "Inking the final pages..."
];
