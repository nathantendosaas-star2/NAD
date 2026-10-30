import React, { useState } from 'react';
import { Mail, Phone, Instagram, MapPin, Check, Send } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSubmitted(true);
  };

  return (
    <div className="pt-24 sm:pt-28 pb-28 px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1920px] mx-auto min-h-screen bg-[#EFEBE3] text-[#141414]">
      <div className="mb-12 border-b border-[#DCD5C9] pb-8 max-w-4xl">
        <span className="font-satoshi text-xs font-bold tracking-[0.25em] uppercase text-[#C9473B] block mb-2">
          + CONCIERGE & INQUIRIES · STUDIO 18
        </span>
        <h1 className="font-serif-heavy text-[clamp(1.5rem,4.5vw,3.5rem)] uppercase tracking-tighter text-[#141414] leading-[0.95] break-words">
          Contact Us
        </h1>
        <p className="font-satoshi text-sm text-[#5E5950] mt-3 max-w-md font-medium">
          Reach our Studio 18 design team for bespoke custom tailoring, wholesale inquiries, press, and international orders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Form Card */}
        <div className="bg-[#FFFFFF] border border-[#DCD5C9] p-8 md:p-12 relative rounded-3xl shadow-xs">
          <span className="absolute top-3 left-3 text-[10px] font-mono text-[#C9473B] leading-none">+</span>
          <span className="absolute bottom-3 right-3 text-[10px] font-mono text-[#C9473B] leading-none">+</span>

          {isSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-serif-heavy text-3xl uppercase text-[#141414]">
                Message Received
              </h3>
              <p className="font-satoshi text-sm text-[#5E5950] max-w-sm mx-auto font-medium">
                Thank you for reaching out to Nairobi Apparel District. Our concierge will review your note and respond within 24 hours.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setName('');
                  setEmail('');
                  setPhone('');
                  setMessage('');
                }}
                className="mt-4 px-7 py-3 bg-[#C9473B] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#b03c31] transition-colors rounded-full shadow-md"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 font-satoshi text-xs">
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#6E685E] block mb-1.5">
                  Your Full Name*
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full bg-[#FAF7F2] text-[#141414] border border-[#DCD5C9] p-3 text-sm rounded-xl focus:outline-none focus:border-[#C9473B]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#6E685E] block mb-1.5">
                  Email Address*
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-[#FAF7F2] text-[#141414] border border-[#DCD5C9] p-3 text-sm rounded-xl focus:outline-none focus:border-[#C9473B]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#6E685E] block mb-1.5">
                  Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 794 417210"
                  className="w-full bg-[#FAF7F2] text-[#141414] border border-[#DCD5C9] p-3 text-sm rounded-xl focus:outline-none focus:border-[#C9473B]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#6E685E] block mb-1.5">
                  Message / Silhouette Inquiry*
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you're interested in (sizing, international shipment, custom denim)..."
                  className="w-full bg-[#FAF7F2] text-[#141414] border border-[#DCD5C9] p-3 text-sm rounded-xl focus:outline-none focus:border-[#C9473B]"
                />
              </div>

              <button
                type="submit"
                data-cursor="DISPATCH"
                className="w-full py-4 bg-[#C9473B] text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#b03c31] transition-colors flex items-center justify-center gap-2 rounded-full shadow-lg"
              >
                <span>Dispatch Inquiry</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Studio & Channels */}
        <div className="space-y-8 font-satoshi text-sm">
          <div className="bg-[#FFFFFF] border border-[#DCD5C9] p-8 space-y-6 relative rounded-3xl shadow-xs">
            <span className="absolute top-3 left-3 text-[10px] font-mono text-[#C9473B] leading-none">+</span>
            <span className="absolute bottom-3 right-3 text-[10px] font-mono text-[#C9473B] leading-none">+</span>

            <h3 className="font-serif-heavy text-2xl uppercase text-[#141414]">
              Direct Communication Channels
            </h3>

            <div className="space-y-4">
              <a
                href="mailto:info@nairobiappareldistrict.com"
                className="flex items-center gap-3 p-4 bg-[#FAF7F2] border border-[#DCD5C9] hover:border-[#C9473B] transition-colors rounded-2xl group shadow-xs"
              >
                <Mail className="w-5 h-5 text-[#C9473B]" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#6E685E] block">
                    Official Email
                  </span>
                  <strong className="text-sm text-[#141414] group-hover:text-[#C9473B] transition-colors">
                    info@nairobiappareldistrict.com
                  </strong>
                </div>
              </a>

              <a
                href="https://wa.me/254794417210"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-4 bg-[#FAF7F2] border border-[#DCD5C9] hover:border-[#C9473B] transition-colors rounded-2xl group shadow-xs"
              >
                <Phone className="w-5 h-5 text-emerald-600" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#6E685E] block">
                    Concierge Line
                  </span>
                  <strong className="text-sm text-[#141414] group-hover:text-[#C9473B] transition-colors">
                    +254 794 417210
                  </strong>
                </div>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-4 bg-[#FAF7F2] border border-[#DCD5C9] hover:border-[#C9473B] transition-colors rounded-2xl group shadow-xs"
              >
                <Instagram className="w-5 h-5 text-[#C9473B]" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#6E685E] block">
                    Instagram
                  </span>
                  <strong className="text-sm text-[#141414] group-hover:text-[#C9473B] transition-colors">
                    @nairobiappareldistrict
                  </strong>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#DCD5C9] p-8 space-y-3 rounded-3xl shadow-xs">
            <div className="flex items-center gap-2 text-[#C9473B]">
              <MapPin className="w-4 h-4" />
              <h4 className="font-serif-heavy text-lg uppercase text-[#141414]">
                Studio 18 Reception
              </h4>
            </div>
            <p className="text-xs text-[#5E5950] leading-relaxed">
              Studio 18, Wood Avenue, Kilimani, Nairobi, Kenya. Our team is available on site Tuesday through Saturday.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
