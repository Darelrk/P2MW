"use client";

import React, { useEffect } from "react";
import { Camera } from "lucide-react";

interface ARViewerProps {
  modelUrl: string;
  posterUrl?: string;
  alt?: string;
  autoRotate?: boolean;
}

const ARViewer: React.FC<ARViewerProps> = ({
  modelUrl,
  posterUrl,
  alt = "AMOUREA 3D Bouquet",
  autoRotate = true,
}) => {
  return (
    <div className="relative w-full aspect-square md:aspect-video rounded-3xl overflow-hidden bg-stone-100 dark:bg-stone-900/50 shadow-inner flex items-center justify-center border border-stone-200/50 dark:border-stone-800/50">
      <style>{`
        #ar-prompt {
          position: absolute;
          bottom: 120px;
          left: 50%;
          transform: translateX(-50%);
          display: none;
        }
        model-viewer[ar-status="session-started"] > #ar-prompt {
          display: block;
        }
        .progress-bar {
          display: block;
          width: 33%;
          height: 10%;
          max-height: 2px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 100px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          background-color: rgba(0, 0, 0, 0.1);
        }
        .progress-bar.hide {
          visibility: hidden;
          transition: visibility 0.3s;
        }
        .update-bar {
          background-color: #6366f1;
          width: 0%;
          height: 100%;
          border-radius: 100px;
          float: left;
          transition: width 0.3s;
        }
      `}</style>
      
      <model-viewer
        src={modelUrl}
        poster={posterUrl}
        alt={alt}
        ar
        ar-modes="scene-viewer quick-look webxr"
        ar-placement="floor"
        ar-scale="fixed"
        camera-controls
        auto-rotate={autoRotate ? "" : undefined}
        shadow-intensity="1"
        environment-image="neutral"
        exposure="1"
        style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
        touch-action="none"
      >
        {/* Loading Indicator */}
        <div className="progress-bar" slot="progress-bar">
          <div className="update-bar"></div>
        </div>

        <button
          slot="ar-button"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full font-medium flex items-center gap-2 hover:bg-white/20 transition-all active:scale-95 shadow-2xl pointer-events-auto"
        >
          <Camera className="w-4 h-4" />
          Lihat di Ruangan Anda
        </button>

        {/* Plane Detection Prompt */}
        <div id="ar-prompt" slot="ar-prompt">
          <img src="https://modelviewer.dev/shared-assets/icons/hand.png" className="w-20 h-20 invert animate-pulse" alt="Move device" />
          <p className="text-white text-[10px] text-center mt-2 font-medium tracking-widest uppercase opacity-80">Goyangkan HP untuk deteksi lantai</p>
        </div>

        {/* AR Failure / Helper Message */}
        <div slot="ar-failure" className="absolute inset-0 z-50 flex items-center justify-center bg-stone-900/80 backdrop-blur-md p-8 text-center">
            <div className="max-w-xs">
                <p className="text-white text-sm font-medium mb-4">
                  Kamera AR hanya tersedia di Smartphone. 📱
                </p>
                <p className="text-white/60 text-xs leading-relaxed">
                  Buka website ini melalui HP Anda untuk melihat buket bunga mendarat tepat di depan mata Anda.
                </p>
            </div>
        </div>
      </model-viewer>

      {/* Overlay Dekoratif ciri khas AMOUREA */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <span className="text-[10px] tracking-[0.2em] font-medium text-stone-400 dark:text-stone-500 uppercase">
          Digital Tactility
        </span>
      </div>
    </div>
  );
};

export default ARViewer;
