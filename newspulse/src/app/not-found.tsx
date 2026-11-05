import Link from "next/link";
import { Search, Home, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 py-10 md:py-16 relative overflow-hidden">
      {/* Subtle newsprint background texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmYiLz4KPC9zdmc+')]" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Big 404 */}
        <h1 className="text-8xl sm:text-9xl font-black tracking-tighter leading-none! text-slate-800 mb-6 select-none">
          404
        </h1>

        {/* Illustration-inspired visual */}
        <div className="relative mx-auto mb-10 w-64 h-48 sm:w-80 sm:h-56">
          {/* Newspaper stack */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Main newspaper */}
              <div className="w-48 h-32 sm:w-56 sm:h-36 transform -rotate-6 relative">
                <svg
                  className="w-full h-full drop-shadow-md text-slate-800"
                  viewBox="0 0 192 128"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    {/* 1. Moved filters to the top of the definitions block */}
                    <filter
                      id="torn-edge-filter"
                      x="-20%"
                      y="-20%"
                      width="140%"
                      height="140%"
                    >
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.09"
                        numOctaves="5"
                        result="noise"
                      />
                      <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="8" /* Adjusted scale down to prevent clipping outside 192x128 bounding box */
                        xChannelSelector="R"
                        yChannelSelector="G"
                        result="ripped"
                      />
                    </filter>

                    <filter id="paper-texture">
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.02"
                        numOctaves="4"
                        result="texture"
                      />
                      <feDiffuseLighting
                        in="texture"
                        lightingColor="#fff"
                        surfaceScale="1.5"
                        result="light"
                      >
                        <feDistantLight azimuth="50" elevation="60" />
                      </feDiffuseLighting>
                      <feBlend mode="multiply" in="SourceGraphic" in2="light" />
                    </filter>
                  </defs>

                  {/* Group applied with paper texture */}
                  <g filter="url(#paper-texture)">
                    {/* Newspaper Background & Border */}
                    <rect
                      x="0.5"
                      y="0.5"
                      width="191"
                      height="127"
                      rx="2"
                      fill="white"
                      stroke="#E2E8F0"
                    />

                    {/* Header / Title Line (Top) */}
                    <rect
                      x="12"
                      y="12"
                      width="168"
                      height="8"
                      rx="4"
                      fill="#E2E8F0"
                    />

                    {/* Text Lines */}
                    <rect
                      x="12"
                      y="28"
                      width="148"
                      height="6"
                      rx="3"
                      fill="#F1F5F9"
                    />
                    <rect
                      x="12"
                      y="44"
                      width="132"
                      height="6"
                      rx="3"
                      fill="#F1F5F9"
                    />
                    <rect
                      x="12"
                      y="60"
                      width="156"
                      height="6"
                      rx="3"
                      fill="#F1F5F9"
                    />
                    <rect
                      x="12"
                      y="76"
                      width="120"
                      height="6"
                      rx="3"
                      fill="#F1F5F9"
                    />
                    <rect
                      x="12"
                      y="92"
                      width="140"
                      height="6"
                      rx="3"
                      fill="#F1F5F9"
                    />

                    {/* Torn Hole (Correctly referencing unique filter ID) */}
                    <path
                      d="M96,36 
           C104,34 115,38 121,45 
           C126,51 129,61 127,70 
           C125,80 120,89 111,93 
           C102,97 90,95 82,90 
           C74,86 66,77 65,67 
           C64,57 71,46 79,41 
           C85,37 91,37 96,36 Z"
                      fill="currentColor"
                      opacity="0.9"
                      filter="url(#torn-edge-filter)"
                    />
                  </g>
                </svg>
              </div>

              {/* Magnifying glass */}
              <div className="absolute -right-4 bottom-2 sm:-right-10 z-10 sm:bottom-4 animate-bounce">
                <svg
                  className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md text-slate-700"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://w3.org/2000/svg"
                >
                  {/* Glass Backdrop Blur effect (matches your original styling) */}
                  <circle
                    cx="45"
                    cy="45"
                    r="30"
                    className="fill-white/70 backdrop-blur-sm"
                  />

                  {/* Magnifying Glass Frame */}
                  <circle
                    cx="45"
                    cy="45"
                    r="30"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="none"
                  />

                  {/* Thick Rounded Handle (perfectly angled at 45 degrees from the rim) */}
                  <path
                    d="M66.5 66.5 L88 88"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Floating paper pieces */}
              <div className="absolute -top-6 -left-8 w-10 h-14 bg-white border border-slate-200 shadow-sm rotate-12 opacity-90" />
              <div className="absolute -bottom-4 -left-10 w-8 h-12 bg-white border border-slate-200 shadow-sm -rotate-12 opacity-850" />
              <div className="absolute top-2 -right-10 w-9 h-11 bg-white border border-slate-200 shadow-sm rotate-6 opacity-75" />
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Article Not Found
          </h2>
          <p className="text-slate-600 text-lg max-w-md mx-auto leading-relaxed">
            The story you’re looking for seems to have gone missing from the
            archive. It may have been moved, unpublished, or never existed.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 font-medium"
            >
              <Home className="w-4 h-4" />
              Back to Homepage
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 font-medium"
            >
              <Search className="w-4 h-4" />
              Search Articles
            </Link>
          </Button>
        </div>

        {/* Extra news-style suggestion */}
        <div className="text-sm text-slate-500 flex flex-wrap items-center justify-center gap-2 mt-14 pt-8 border-t border-slate-200">
          <p className="inline-flex items-center gap-1">
            <Newspaper className="w-4 h-4" />
            Looking for the latest stories? Check out our{" "}
          </p>
          <Link
            href="/"
            className="underline underline-offset-2 hover:text-slate-800"
          >
            latest articles
          </Link>
        </div>
      </div>
    </div>
  );
}
