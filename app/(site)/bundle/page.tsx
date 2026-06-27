'use client';
import MainNav from "@/components/MainNav";
import Link from "next/link"

const Bundle = () => {
  return (
    <>
    <header className="relative z-50">
    <MainNav />
  </header>
    <div className="py-32 bg-linear-to-br from-sky-600/20 via-sky-700/10 to-sky-600/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 border-2 border-sky-500/40 shadow-2xl">
      <div className="text-center">
       
        <img
          src="/ZZZZ7.77_ (1) (2).png"
          alt="Freelancer Detector Kit"
          className="w-full h-full object-cover rounded-lg border border-gray-300 shadow-md mb-4"
        />
        <h4 className="mb-2 wrap-break-word px-0.5 text-lg font-bold text-black sm:text-xl">7 EBooks Bundle – $7.77 Today</h4>
        <p className="text-sm text-gray-700 mb-6">
          Purchase today and your order will be sent to your email later today - digital PDF.
        </p>
        <Link
          href="#"
          className="inline-block w-auto rounded-lg bg-purple-700 px-3 py-3 text-center text-sm font-bold leading-snug text-white wrap-break-word transition-colors hover:bg-purple-800 sm:px-4 sm:text-base"
        >
          Click for details on 7 EBooks Bundle
        </Link>
      </div>
    </div>
    <footer className="border-t border-black/20 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-black font-bold text-lg">
            © {new Date().getFullYear()} SeniorsStuck.com. All rights reserved.
          </p>
          <p className="text-black font-bold text-lg mt-4">
            <a
              href="mailto:mjohnsonsports@aol.com"
              className="font-bold text-amber-900 underline-offset-2 transition-colors hover:text-amber-950 hover:underline"
            >
              mjohnsonsports@aol.com
            </a>
          </p>
        </div>
      </footer>
    </>
  )
}

export default Bundle
