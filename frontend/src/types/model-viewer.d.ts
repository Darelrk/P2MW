import React from "react";

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        "model-viewer": React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            src?: string;
            poster?: string;
            alt?: string;
            ar?: boolean;
            "ar-modes"?: string;
            "ar-placement"?: string;
            "ar-scale"?: string;
            "camera-controls"?: boolean;
            "auto-rotate"?: string | boolean;
            loading?: "eager" | "lazy";
            reveal?: "auto" | "manual";
            "shadow-intensity"?: string;
            "shadow-softness"?: string;
            "environment-image"?: string;
            exposure?: string;
            "touch-action"?: string;
          },
          HTMLElement
        >;
      }
    }
  }
}

export {};
