import Link from "next/link";

export default function BlogCTA() {
  return (
    <section className="rounded-lg border border-purple-200 bg-purple-50 p-6 sm:p-8">
      <h2 className="text-2xl font-black text-gray-950">Ready to get unstuck?</h2>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-gray-700">
        Get clear, practical online business guidance written for people 55+.
      </p>
      <Link
        href="/product"
        className="mt-5 inline-flex rounded-md bg-purple-700 px-6 py-3 text-lg font-bold text-white transition-colors hover:bg-purple-800"
      >
        See the newsletter
      </Link>
    </section>
  );
}
