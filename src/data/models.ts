export interface ModelItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  mainImage: string;
  galleryImages: string[];
  description: string;
  nextSlug: string;
  prevSlug: string;
}

export const MODELS: ModelItem[] = [
  {
    id: 'model-9',
    slug: 'model-9',
    title: 'NAD & FRIENDS FT. TRAUPHE',
    category: 'Design',
    tags: ['Design', 'Collaboration', 'Couture'],
    mainImage: 'https://images.unsplash.com/photo-1547069687-b01db9659136?auto=format&fit=crop&q=85&w=1200',
    galleryImages: [
      'https://images.unsplash.com/photo-1547069687-b01db9659136?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1580644228275-2b826dbec5bf?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1567934859879-9addfb1e07f8?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1608147152875-b0eb0c53d491?auto=format&fit=crop&q=85&w=1200',
    ],
    description: 'Collaborative art piece featuring Trauphe graphic embroidery on a tailored raw denim cropped canvas. Exhibited piece created for the Africa Fashion Diaspora showcase in Nairobi.',
    nextSlug: 'model-8',
    prevSlug: 'model-1',
  },
  {
    id: 'model-8',
    slug: 'model-8',
    title: 'model 8',
    category: 'Design',
    tags: ['Design', 'Streetwear'],
    mainImage: 'https://images.unsplash.com/photo-1580644228275-2b826dbec5bf?auto=format&fit=crop&q=85&w=1200',
    galleryImages: [
      'https://images.unsplash.com/photo-1580644228275-2b826dbec5bf?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1608147152875-b0eb0c53d491?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1567934859879-9addfb1e07f8?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1547069687-b01db9659136?auto=format&fit=crop&q=85&w=1200',
    ],
    description: 'Ulla ut felis tristique, dolor euismod faucibus eu vitae velit. Praesent non enim efficitur, metus non, facilisi lectus. Curabitur in porttitor turpis, quis metus males ada nisl. Ut ad acmaurisvel ligula mattis tristique. Crasu lacinia neque vel suscipit mattis, duis vitam sit ad quo.',
    nextSlug: 'model-7',
    prevSlug: 'model-9',
  },
  {
    id: 'model-7',
    slug: 'model-7',
    title: 'model 7',
    category: 'Design',
    tags: ['Design', 'Couture'],
    mainImage: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=1200',
    galleryImages: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1580644228275-2b826dbec5bf?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1608147152875-b0eb0c53d491?auto=format&fit=crop&q=85&w=1200',
    ],
    description: 'Structured silhouette composed of upcycled East African drills and salvaged military surplus fabrics. Precision cut and tailored in Studio 18.',
    nextSlug: 'model-6',
    prevSlug: 'model-8',
  },
  {
    id: 'model-6',
    slug: 'model-6',
    title: 'model 6',
    category: 'Design',
    tags: ['Design', 'Upcycled'],
    mainImage: 'https://images.unsplash.com/photo-1567934859879-9addfb1e07f8?auto=format&fit=crop&q=85&w=1200',
    galleryImages: [
      'https://images.unsplash.com/photo-1567934859879-9addfb1e07f8?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1547069687-b01db9659136?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1580644228275-2b826dbec5bf?auto=format&fit=crop&q=85&w=1200',
    ],
    description: 'Architectural outerwear exploring heavy raw denim and functional hardware accents. Designed and produced at Kilimani Atelier.',
    nextSlug: 'model-5',
    prevSlug: 'model-7',
  },
  {
    id: 'model-5',
    slug: 'model-5',
    title: 'model 5',
    category: 'Design',
    tags: ['Design', 'Tactical'],
    mainImage: 'https://images.unsplash.com/photo-1608147152875-b0eb0c53d491?auto=format&fit=crop&q=85&w=1200',
    galleryImages: [
      'https://images.unsplash.com/photo-1608147152875-b0eb0c53d491?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1567934859879-9addfb1e07f8?auto=format&fit=crop&q=85&w=1200',
    ],
    description: 'Tactical vest exploration combining modular utility pockets, brass zippers, and hand-stitched Swahili geometric detailing.',
    nextSlug: 'model-4',
    prevSlug: 'model-6',
  },
  {
    id: 'model-4',
    slug: 'model-4',
    title: 'model 4',
    category: 'Design',
    tags: ['Design', 'Monogram'],
    mainImage: 'https://images.unsplash.com/photo-1580644228275-2b826dbec5bf?auto=format&fit=crop&q=85&w=1200',
    galleryImages: [
      'https://images.unsplash.com/photo-1580644228275-2b826dbec5bf?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1547069687-b01db9659136?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1608147152875-b0eb0c53d491?auto=format&fit=crop&q=85&w=1200',
    ],
    description: 'Flagship military jacket featuring embroidered Nairobi Apparel District monograms and custom brass snaps.',
    nextSlug: 'model-3',
    prevSlug: 'model-5',
  },
  {
    id: 'model-3',
    slug: 'model-3',
    title: 'model 3',
    category: 'Design',
    tags: ['Design', 'Minimal'],
    mainImage: 'https://images.unsplash.com/photo-1547069687-b01db9659136?auto=format&fit=crop&q=85&w=1200',
    galleryImages: [
      'https://images.unsplash.com/photo-1547069687-b01db9659136?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1567934859879-9addfb1e07f8?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=1200',
    ],
    description: 'Refined linen and raw denim pairing designed for tropical metropolitan wear in East Africa.',
    nextSlug: 'model-2',
    prevSlug: 'model-4',
  },
  {
    id: 'model-2',
    slug: 'model-2',
    title: 'model 2',
    category: 'Design',
    tags: ['Design', 'Heritage'],
    mainImage: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=1200',
    galleryImages: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1580644228275-2b826dbec5bf?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1608147152875-b0eb0c53d491?auto=format&fit=crop&q=85&w=1200',
    ],
    description: 'Art-cycled tailored piece showcasing contrast raw seams and sustainable organic cotton canvas construction.',
    nextSlug: 'model-1',
    prevSlug: 'model-3',
  },
  {
    id: 'model-1',
    slug: 'model-1',
    title: 'model',
    category: 'Design',
    tags: ['Design', 'Archive'],
    mainImage: 'https://images.unsplash.com/photo-1567934859879-9addfb1e07f8?auto=format&fit=crop&q=85&w=1200',
    galleryImages: [
      'https://images.unsplash.com/photo-1567934859879-9addfb1e07f8?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1547069687-b01db9659136?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1580644228275-2b826dbec5bf?auto=format&fit=crop&q=85&w=1200',
    ],
    description: 'Original foundational model piece from the inaugural Nairobi Apparel District presentation.',
    nextSlug: 'model-9',
    prevSlug: 'model-2',
  },
];
