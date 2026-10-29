import React from 'react';
import { X, Globe, Sparkles, ShieldCheck } from 'lucide-react';

interface BrandStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandStoryModal: React.FC<BrandStoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 md:p-8" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative bg-[#E4E2DD] max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#1E1E1E]/20 shadow-2xl p-8 md:p-14 z-10 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#1E1E1E] hover:text-[#C9473B] transition-colors focus:outline-none"
          aria-label="Close brand manifesto"
        >
          <X className="w-6 h-6" />
        </button>

        <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#C9473B]">
          Studio 18 · Kilimani, Nairobi
        </span>

        <h2 className="font-clash text-4xl md:text-5xl uppercase tracking-tight text-[#1E1E1E] mt-2 mb-8 leading-none">
          Not Another Disposable.
        </h2>

        <div className="space-y-6 font-satoshi text-base md:text-lg leading-relaxed text-[#1E1E1E]/90">
          <p className="font-medium text-xl leading-normal text-[#1E1E1E]">
            Founded by artist and creative director Junior Orina, Nairobi Apparel District (NAD) is known globally as <em>“The Heart of Art and Upcycling.”</em>
          </p>

          <p>
            We stand in defiance of fast-fashion throwaway culture. Sub-Saharan Africa has long shouldered the burden of global textile waste dumping. NAD transforms this crisis into couture by salvaging discarded raw denims, vintage military surplus, and organic East African cotton—reconstructing them into high-luxury streetwear meant to outlive fleeting trends.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-[#1E1E1E]/15 my-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#C9473B]">
                <Globe className="w-5 h-5" />
                <span className="font-clash text-lg uppercase">Museum at FIT</span>
              </div>
              <p className="text-xs opacity-75 leading-normal">
                Exhibited in New York as part of the <em>Africa&apos;s Fashion Diaspora</em> exhibition at the Museum at FIT.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#C9473B]">
                <Sparkles className="w-5 h-5" />
                <span className="font-clash text-lg uppercase">Creative DNA</span>
              </div>
              <p className="text-xs opacity-75 leading-normal">
                Selected for the prestigious British Council Creative DNA programme advancing ethical craftsmanship in East Africa.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#C9473B]">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-clash text-lg uppercase">Cultural Voice</span>
              </div>
              <p className="text-xs opacity-75 leading-normal">
                Wardrobe architects for prominent African innovators and musicians including Sauti Sol and Buruklyn Boyz.
              </p>
            </div>
          </div>

          <p>
            Every piece is produced in small, numbered drops inside our Kilimani atelier. By supporting NAD, you invest in regenerative textile ecosystems, artisan livelihoods, and an African renaissance in circular design.
          </p>
        </div>

        <div className="mt-10 pt-6 border-t border-[#1E1E1E]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="font-clash text-xl uppercase tracking-wider block">Junior Orina</span>
            <span className="text-xs opacity-60 font-satoshi uppercase tracking-widest">
              Founder & Creative Director, NAD
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-8 py-3.5 bg-[#C9473B] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#A83C2F] transition-colors"
          >
            Explore The Collection
          </button>
        </div>
      </div>
    </div>
  );
};
