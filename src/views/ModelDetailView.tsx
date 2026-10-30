import React, { useState } from 'react';
import { MODELS, ModelItem } from '../data/models';
import { ArrowRight, ArrowLeft, Tag, Layers, Image as ImageIcon, X } from 'lucide-react';

interface ModelDetailViewProps {
  modelSlug: string;
  onNavigateToModel: (modelSlug: string) => void;
  onBackToCollections: () => void;
}

export const ModelDetailView: React.FC<ModelDetailViewProps> = ({
  modelSlug,
  onNavigateToModel,
  onBackToCollections,
}) => {
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<string | null>(null);

  // Find current model by slug or id
  const currentModel = MODELS.find(
    (m) => m.slug === modelSlug || m.id === modelSlug
  );

  // Fallback / Unknown model state
  if (!currentModel) {
    return (
      <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto text-center min-h-[60vh] flex flex-col items-center justify-center bg-[#FFFFFF]">
        <span className="font-mono text-xs uppercase tracking-widest text-[#C9473B] font-bold block mb-2">
          404 · MODEL ARCHIVE NOT FOUND
        </span>
        <h1 className="font-serif-heavy text-3xl sm:text-5xl uppercase text-[#141414] mb-4">
          Model Entry Unavailable
        </h1>
        <p className="font-satoshi text-sm sm:text-base text-[#5E5950] mb-8 max-w-md">
          The portfolio entry you requested does not exist or has been moved in the Nairobi Apparel District archive.
        </p>
        <button
          onClick={onBackToCollections}
          className="px-6 py-3 bg-[#C9473B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#b03c31] transition-all shadow-md flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Collections</span>
        </button>
      </div>
    );
  }

  // Next model lookup for bottom navigation
  const nextModel = MODELS.find((m) => m.slug === currentModel.nextSlug) || MODELS[0];

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-[#FFFFFF] text-[#141414] min-h-screen selection:bg-[#C9473B] selection:text-white">
      {/* Lightbox Modal */}
      {selectedLightboxImage && (
        <div
          onClick={() => setSelectedLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button
            onClick={() => setSelectedLightboxImage(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedLightboxImage}
            alt={currentModel.title}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}

      {/* Main Single Model Grid Container (Reference 2 Layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#6E685E] pb-6 mb-8 border-b border-[#141414]/10">
          <button
            onClick={onBackToCollections}
            className="hover:text-[#C9473B] transition-colors flex items-center gap-1.5 font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Collection</span>
          </button>
          <span className="text-[#C9473B] font-bold">/</span>
          <span className="text-[#141414] font-bold">{currentModel.title}</span>
        </div>

        {/* Content Split: Left Masonry Gallery / Right Sticky Meta Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Media Gallery (Masonry Grid from Reference 2) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentModel.galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedLightboxImage(img)}
                  className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-[#FAF7F2] border border-[#DCD5C9] cursor-zoom-in shadow-xs"
                >
                  <img
                    src={img}
                    alt={`${currentModel.title} image ${idx + 1}`}
                    loading={idx < 2 ? 'eager' : 'lazy'}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/90 text-[#141414] font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold shadow-md flex items-center gap-1">
                      <ImageIcon className="w-3 h-3 text-[#C9473B]" /> Zoom
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sticky Sidebar (Title, Bio, Info Details from Reference 2) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-8 bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-[#DCD5C9] shadow-xs">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#C9473B] block mb-2 font-bold">
                + PORTFOLIO ENTRY
              </span>
              <h1 className="font-serif-heavy text-3xl sm:text-5xl uppercase text-[#141414] leading-tight tracking-tight">
                {currentModel.title}
              </h1>
            </div>

            {/* Model Description / Biography */}
            <div className="font-satoshi text-sm sm:text-base text-[#5E5950] leading-relaxed font-normal space-y-4 border-t border-[#DCD5C9] pt-6">
              <p>{currentModel.description}</p>
            </div>

            {/* Portfolio Info Metadata (Category & Tags) */}
            <div className="space-y-4 border-t border-[#DCD5C9] pt-6 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#6E685E] font-bold uppercase flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#C9473B]" /> Category:
                </span>
                <span className="bg-[#FFFFFF] text-[#141414] border border-[#DCD5C9] px-3 py-1 rounded-full font-bold">
                  {currentModel.category}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-[#6E685E] font-bold uppercase flex items-center gap-1.5 pt-1">
                  <Tag className="w-3.5 h-3.5 text-[#C9473B]" /> Tags:
                </span>
                <div className="flex flex-wrap gap-1.5 justify-end max-w-[60%]">
                  {currentModel.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-[#FFFFFF] text-[#C9473B] border border-[#DCD5C9] px-2.5 py-0.5 rounded text-[10px] font-bold uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Return Link Button */}
            <div className="pt-2">
              <button
                onClick={onBackToCollections}
                className="w-full py-3.5 bg-[#141414] hover:bg-[#C9473B] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back To Archive</span>
              </button>
            </div>
          </div>
        </div>

        {/* Single Portfolio Bottom Navigation Bar (Reference 2 Implementation) */}
        <div id="single-portfolio-navigation" className="mt-16 pt-8 border-t border-[#DCD5C9]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-[#DCD5C9] shadow-xs">
            {/* Archive Back Link */}
            <button
              onClick={onBackToCollections}
              className="group flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#141414] hover:text-[#C9473B] transition-colors font-bold"
            >
              <div className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#DCD5C9] flex items-center justify-center text-[#141414] group-hover:text-[#C9473B] group-hover:border-[#C9473B] transition-all">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span>Archive page</span>
            </button>

            {/* Next Model Direct Link & Card Preview */}
            <button
              onClick={() => onNavigateToModel(nextModel.slug)}
              className="group flex items-center gap-4 text-right hover:text-[#C9473B] transition-colors"
            >
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-bold text-[#C9473B]">
                  <span>See Next</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="font-serif-heavy text-lg uppercase text-[#141414] mt-0.5">
                  {nextModel.title}
                </span>
              </div>

              {/* Next Model Thumbnail */}
              <div className="w-14 h-18 rounded-lg overflow-hidden border border-[#DCD5C9] bg-[#FFFFFF] shrink-0 shadow-xs">
                <img
                  src={nextModel.mainImage}
                  alt={nextModel.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
