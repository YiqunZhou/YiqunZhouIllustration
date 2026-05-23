/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Instagram, Mail, Menu } from "lucide-react";
import {
  IMAGES,
  SECTIONS,
  IMAGE_DESCRIPTIONS,
  type SectionConfig,
  type RowConfig,
} from "./constants.ts";

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const RepeatingTitle: React.FC<{ title: string }> = ({ title }) => {
  const repeated = new Array(100).fill(title).join("");
  return (
    <div className="w-full py-1 font-cursive text-2xl opacity-40 whitespace-nowrap overflow-hidden lowercase select-none leading-none">
      {repeated}
    </div>
  );
};

const ImageCard: React.FC<{
  imgKey: keyof typeof IMAGES;
  onClick: () => void;
}> = ({ imgKey, onClick }) => (
  <div
    onClick={onClick}
    className="relative group w-full h-auto mb-1 md:mb-2 overflow-hidden cursor-pointer"
  >
    <img
      src={IMAGES[imgKey]}
      alt={String(imgKey)}
      referrerPolicy="no-referrer"
      className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
    />
    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-accent/40 backdrop-blur-[2px] pointer-events-none">
      <span className="text-[10px] uppercase tracking-[0.2em] text-primary-bg font-mono px-4 py-2 bg-accent/90 rounded-md">
        {String(imgKey).split(".")[0]}
      </span>
    </div>
  </div>
);

const Section: React.FC<{
  section: SectionConfig;
  isFirst: boolean;
  onSelectImage: (img: keyof typeof IMAGES) => void;
}> = ({ section, isFirst, onSelectImage }) => {
  const allImages = section.rows.flatMap((row) => row.images);

  // Create N empty arrays for columns
  const columns: (keyof typeof IMAGES)[][] = Array.from(
    { length: section.columns },
    () => [],
  );

  // Distribute images across columns
  allImages.forEach((img, i) => {
    columns[i % section.columns].push(img);
  });

  return (
    <section id={section.id} className="pt-4">
      <RepeatingTitle title={section.title} />
      <div
        className={`grid ${section.columns === 3 ? "grid-cols-3" : "grid-cols-2"} gap-1 px-1 md:gap-2 md:px-2 py-4 items-center`}
      >
        {columns.map((colImages, colIdx) => (
          <div key={colIdx} className="flex flex-col">
            {colImages.map((img, imgIdx) => (
              <ImageCard
                key={`${img}-${imgIdx}`}
                imgKey={img}
                onClick={() => onSelectImage(img)}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

interface PreloaderProps {
  progress: number;
}

const Preloader: React.FC<PreloaderProps> = ({ progress }) => {
  const [imgUrl, setImgUrl] = useState(
    "https://res.cloudinary.com/dufnjfidt/image/upload/v1779253452/mac_sync_folder/peace1.png",
  );
  const [fallbackIndex, setFallbackIndex] = useState(0);

  const handleImageError = () => {
    if (fallbackIndex === 0) {
      setImgUrl(
        "https://res.cloudinary.com/dufnjfidt/image/upload/v1779501259/mac_sync_folder/peace1.png",
      );
      setFallbackIndex(1);
    } else if (fallbackIndex === 1) {
      setImgUrl(
        "https://res.cloudinary.com/dufnjfidt/image/upload/v1779501259/mac_sync_folder/peace.png",
      );
      setFallbackIndex(2);
    }
  };

  return (
    <motion.div
      key="preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[10000] bg-[#48524a] flex flex-col items-center justify-center font-sans select-none"
      style={{
        backgroundImage:
          'url("https://res.cloudinary.com/dufnjfidt/image/upload/v1779253452/mac_sync_folder/pattern1.png")',
        backgroundRepeat: "repeat",
        backgroundPosition: "0 0",
        backgroundSize: "auto",
      }}
    >
      <div className="flex flex-col items-center max-w-sm px-8 text-center gap-6">
        {/* Peace Icon */}
        <div className="w-28 h-28 flex items-center justify-center overflow-hidden mb-1">
          <img
            src={imgUrl}
            alt="YZ Circle Icon"
            onError={handleImageError}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Artist Moniker */}
        <div className="space-y-1">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="font-serif text-xl tracking-[0.25em] font-medium text-accent uppercase"
          >
            Yiqun Zhou
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            transition={{ delay: 0.3 }}
            className="text-[9px] uppercase tracking-[0.2em] font-mono text-accent"
          >
            Illustrations & Comics
          </motion.p>
        </div>

        {/* Progressive Loading Percentage */}
        <div className="relative flex flex-col items-center">
          <motion.div className="flex items-baseline font-serif">
            <span className="text-5xl md:text-6xl font-normal text-accent tabular-nums tracking-tighter">
              {progress}
            </span>
            <span className="text-xl md:text-2xl text-accent font-light opacity-80 italic ml-1">
              %
            </span>
          </motion.div>
        </div>

        {/* Sleek Progress Track */}
        <div className="w-48 h-[2px] bg-accent/20 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-accent"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

interface SidebarContentProps {
  onClose?: () => void;
  copyEmail: (e: React.MouseEvent) => void;
  showEmailToast: boolean;
  toastPos: { x: number; y: number };
  email: string;
  isMobileDrawer?: boolean;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  onClose,
  copyEmail,
  showEmailToast,
  toastPos,
  email,
  isMobileDrawer = false,
}) => {
  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-10">
          <h1
            className={`${isMobileDrawer ? "text-3xl" : "text-[2.6vw]"} font-serif font-semibold tracking-[0.05em] leading-none text-left break-words text-accent`}
          >
            YIQUN ZHOU
          </h1>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden w-8 h-8 rounded-full border border-accent/25 text-accent flex items-center justify-center font-serif text-sm font-normal cursor-pointer hover:bg-accent hover:text-primary-bg transition-colors duration-200"
              title="Close Menu"
            >
              X
            </button>
          )}
        </div>
        <div className="text-xs opacity-50 mb-8 space-y-0.5">
          <p>Illustrator,</p>
          <p>Comic Artist,</p>
          <p>Graphic Designer</p>
          <p>based in Toronto</p>
          <p>RISD Illustration</p>
          <p>OCAD Digital Future</p>
        </div>

        <div className="text-xs opacity-50 mb-12">
          <p className="mb-1 uppercase tracking-widest border-b border-white/10 pb-1">
            Selected Clients:
          </p>
          <ul className="space-y-0.5">
            <li>Vice China,</li>
            <li>Another Man Magazine,</li>
            <li>Sanlian Magazine</li>
          </ul>
        </div>

        <nav className="flex flex-col gap-2 text-sm font-serif">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                scrollToSection(s.id);
                if (onClose) onClose();
              }}
              className="text-left hover:translate-x-1 transition-transform group flex items-center cursor-pointer"
            >
              <span className="opacity-40 group-hover:opacity-100 transition-opacity mr-1 font-mono">
                -
              </span>
              <span className="capitalize opacity-60 group-hover:opacity-100 transition-opacity">
                {s.title}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="text-[10px] space-y-4 pt-8">
        <div className="w-[115%] -ml-[7.5%] opacity-80 hover:opacity-100 transition-all duration-300">
          <img
            src="https://res.cloudinary.com/dufnjfidt/image/upload/v1779501259/mac_sync_folder/peace.png"
            alt="Yiqun Zhou Profile"
            className="w-full h-auto block"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex items-center gap-3 relative">
          <a
            href="https://www.instagram.com/bigbrigandhewada/"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            <Instagram size={14} />
          </a>
          <button
            onClick={copyEmail}
            className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer relative"
          >
            <Mail size={14} />

            <AnimatePresence>
              {showEmailToast && (
                <motion.div
                  initial={{ opacity: 0, x: 0, y: 20, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    y: isMobileDrawer ? -50 : -90,
                    scale: 1,
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  style={{
                    left: isMobileDrawer ? "1rem" : "1rem",
                    top: isMobileDrawer ? "auto" : toastPos.y,
                    bottom: isMobileDrawer ? "2rem" : "auto",
                  }}
                  className="fixed bg-accent text-primary-bg px-6 py-4 rounded-xl shadow-2xl z-[9999] pointer-events-none text-center flex flex-col items-center justify-center gap-1 min-w-[240px]"
                >
                  <div className="text-sm md:text-base font-bold whitespace-nowrap font-mono">
                    {email}
                  </div>
                  <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-80 border-t border-primary-bg/20 pt-1 w-full text-center font-mono">
                    copied to clipboard
                  </div>
                  {!isMobileDrawer && (
                    <div
                      className="absolute bottom-[-6px] bg-accent rotate-45 w-3 h-3"
                      style={{ left: `calc(${toastPos.x}px - 1rem - 6px)` }}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
        <div className="opacity-30">© 2026 Yiqun Zhou</div>
      </div>
    </div>
  );
};

// Global in-memory cache to prevent preloaded images from being garbage-collected
const preloadedImageCache: HTMLImageElement[] = [];

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedPercent, setLoadedPercent] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showEmailToast, setShowEmailToast] = useState(false);
  const [toastPos, setToastPos] = useState({ x: 0, y: 0 });
  const [selectedImage, setSelectedImage] = useState<
    keyof typeof IMAGES | null
  >(null);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [imgWidth, setImgWidth] = useState<number | null>(null);
  const email = "zhouyiqunbbh@gmail.com";

  // Preloading image mechanism
  React.useEffect(() => {
    const urls = [
      "https://res.cloudinary.com/dufnjfidt/image/upload/v1779501259/mac_sync_folder/peace.png",
      "https://res.cloudinary.com/dufnjfidt/image/upload/v1779253452/mac_sync_folder/peace1.png",
      "https://res.cloudinary.com/dufnjfidt/image/upload/v1779501259/mac_sync_folder/peace1.png",
      "https://res.cloudinary.com/dufnjfidt/image/upload/v1779253452/mac_sync_folder/pattern1.png",
      ...Object.values(IMAGES),
    ];

    let loadedCount = 0;
    const total = urls.length;

    // Safety timeout to ensure portfolio opens even on slower connections
    const safetyTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 7000);

    urls.forEach((url) => {
      const img = new Image();
      img.referrerPolicy = "no-referrer";
      img.src = url;
      preloadedImageCache.push(img);

      const handleLoad = () => {
        loadedCount++;
        const percent = Math.min(Math.round((loadedCount / total) * 100), 100);
        setLoadedPercent(percent);

        if (loadedCount >= total) {
          clearTimeout(safetyTimer);
          // Brief smooth delay to savor full 100% load
          setTimeout(() => setIsLoaded(true), 500);
        }
      };

      img.onload = handleLoad;
      img.onerror = handleLoad; // Count error states as loaded so we don't block
    });

    return () => clearTimeout(safetyTimer);
  }, []);

  const handleImgLoad = () => {
    if (imgRef.current) {
      setImgWidth(imgRef.current.clientWidth);
    }
  };

  React.useEffect(() => {
    if (!selectedImage) {
      setImgWidth(null);
      return;
    }
    const updateWidth = () => {
      if (imgRef.current) {
        setImgWidth(imgRef.current.clientWidth);
      }
    };
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [selectedImage]);

  const copyEmail = (e: React.MouseEvent) => {
    navigator.clipboard.writeText(email);
    const rect = e.currentTarget.getBoundingClientRect();
    setToastPos({ x: rect.left + rect.width / 2, y: rect.top });
    setShowEmailToast(true);
    setTimeout(() => setShowEmailToast(false), 2000);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans selection:bg-white/20">
      <AnimatePresence mode="wait">
        {!isLoaded && <Preloader progress={loadedPercent} />}
      </AnimatePresence>
      {/* Desktop Sidebar - Fixed width 1/7 of viewport, hidden on mobile */}
      <aside className="hidden md:flex w-[14.28vw] shrink-0 h-full p-6 flex-col justify-between z-50 overflow-y-auto bg-[#48524a]/20 border-r border-accent/5">
        <SidebarContent
          copyEmail={copyEmail}
          showEmailToast={showEmailToast}
          toastPos={toastPos}
          email={email}
        />
      </aside>

      {/* Mobile Menu Button - Floating top left, hidden on desktop */}
      <div className="md:hidden fixed top-4 left-4 z-[90]">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="w-10 h-10 rounded-full border border-accent/20 bg-primary-bg/90 backdrop-blur-md text-accent hover:bg-accent hover:text-primary-bg transition-all duration-300 flex items-center justify-center shadow-lg cursor-pointer select-none"
          title="Open Menu"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Mobile Menu Slide-out Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark minimal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#48524a]/60 backdrop-blur-sm z-[95] md:hidden cursor-pointer"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Drawer Body - Slides in from left */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 w-[80vw] sm:w-[50vw] bg-primary-bg border-r border-accent/10 z-[100] p-6 flex flex-col justify-between overflow-y-auto md:hidden"
            >
              <SidebarContent
                onClose={() => setIsMobileMenuOpen(false)}
                copyEmail={copyEmail}
                showEmailToast={showEmailToast}
                toastPos={toastPos}
                email={email}
                isMobileDrawer={true}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 h-full overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full flex flex-col"
        >
          {SECTIONS.map((section, idx) => (
            <Section
              key={section.id}
              section={section}
              isFirst={idx === 0}
              onSelectImage={setSelectedImage}
            />
          ))}

          {/* Footer spacer */}
          <div className="h-[20vh]" />
        </motion.div>
      </main>

      {/* Expanded image modal overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#48524a]/90 backdrop-blur-md z-[999] flex items-center justify-center p-2 md:p-4 cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 28, stiffness: 200 }}
              className="relative max-w-[96vw] md:max-w-[92vw] lg:max-w-[88vw] max-h-[97vh] flex flex-col items-center gap-0 text-center cursor-default min-w-[280px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fancy Circle close button with serif vibe font */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-8 h-8 md:w-10 md:h-10 rounded-full border border-accent bg-primary-bg text-accent hover:bg-accent hover:text-primary-bg transition-all duration-300 flex items-center justify-center font-serif text-lg md:text-xl font-normal shadow-md cursor-pointer select-none z-[1000]"
                title="Close"
              >
                X
              </button>

              {/* Image Section - No rounded corners, no borders, bg-transparent */}
              <div className="w-full max-h-[82vh] md:max-h-[85vh] flex items-center justify-center overflow-hidden bg-transparent">
                <img
                  ref={imgRef}
                  src={IMAGES[selectedImage]}
                  alt={String(selectedImage)}
                  onLoad={handleImgLoad}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[80vh] md:max-h-[83vh] object-contain select-none shadow-2xl"
                />
              </div>

              {/* Text Description Box - Sharp corners, solid deep olive color background, width matches the dynamic image width */}
              <div
                className="bg-[#384039] px-6 py-5 border-t border-accent/10 transition-all duration-300 shadow-2xl"
                style={{
                  width: imgWidth ? `${imgWidth}px` : "100%",
                  maxWidth: "100%",
                }}
              >
                <div className="w-full mx-auto">
                  {(() => {
                    const desc = IMAGE_DESCRIPTIONS[selectedImage];
                    if (!desc) return null;
                    const colIdx = desc.indexOf(" : ");
                    const descText =
                      colIdx !== -1 ? desc.substring(colIdx + 3) : desc;
                    return (
                      <p className="font-serif text-sm md:text-base text-accent/95 leading-relaxed italic">
                        {descText}
                      </p>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
