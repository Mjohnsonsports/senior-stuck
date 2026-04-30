'use client';

import { useEffect, useState } from 'react';
import MainNav from '@/components/MainNav';

const ENOUGH_IS_ENOUGH_PRICE_ID =
  process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ENOUGH_IS_ENOUGH || 'MISSING_PRICE_ID';

export default function EnoughIsEnoughPage() {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = () => {
    if (!ENOUGH_IS_ENOUGH_PRICE_ID || ENOUGH_IS_ENOUGH_PRICE_ID === 'MISSING_PRICE_ID') {
      alert('Checkout is not configured yet. Please try again later.');
      return;
    }

    setCheckoutLoading(true);
    window.location.href = '/checkout?product=enough-is-enough';
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.enough-page .fade-in').forEach((el) => {
      observer.observe(el);
    });

    document
      .querySelectorAll('.enough-page .benefit-list li, .enough-page .bullet-list li')
      .forEach((li, index) => {
        (li as HTMLElement).style.animationDelay = `${(index % 6) * 0.1 + 0.1}s`;
        observer.observe(li);
      });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="enough-page min-h-screen bg-white text-black">
    
      <style jsx global>{`
        .enough-page {
          font-family: 'Source Sans 3', system-ui, -apple-system, BlinkMacSystemFont,
            'Segoe UI', sans-serif;
          line-height: 1.65;
          color: #333333;
        }
        .enough-page .section {
          padding: 50px 0;
          position: relative;
        }
        .enough-page .section-light {
          background-color: #ffffff;
          color: #333333;
        }
        .enough-page .section-dark {
          background-color: #ffffff;
          color: #000000;
        }
        .enough-page .section-alt-light {
          background-color: #f7f7f7;
          color: #333333;
        }
        .enough-page .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .enough-page .headline {
          font-family: 'Lora', serif;
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 30px;
          text-align: center;
        }
        .enough-page .subheadline {
          font-family: 'Lora', serif;
          font-size: 2.6rem;
          font-weight: 600;
          line-height: 1.2;
          margin-bottom: 25px;
          text-align: center;
        }
        .enough-page .section-subhead {
          font-family: 'Lora', serif;
          font-size: 2.3rem;
          font-weight: 600;
          line-height: 1.3;
          margin: 35px 0 20px 0;
          color: #d84315;
          text-align: center;
        }
        .enough-page .body-text {
          font-size: 1.1rem;
          margin-bottom: 20px;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.65;
        }
        .enough-page .lead-text {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 30px;
          max-width: 650px;
          text-align: center;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.4;
        }
        .enough-page .highlight {
          color: #d84315;
        }
        .enough-page .conversion-bold {
          font-weight: 600;
          color: #d84315;
        }
        .enough-page .cta-button {
          display: block;
          background-color: #d84315;
          color: #ffffff;
          padding: 20px 40px;
          text-decoration: none;
          border-radius: 8px;
          margin: 30px auto 30px;
          transition: all 0.3s ease;
          text-align: center;
          max-width: 400px;
          line-height: 1.2;
          border: none;
          cursor: pointer;
        }
        .enough-page .cta-button:hover {
          background-color: #d84315;
          filter: brightness(0.9);
          transform: translateY(-2px);
        }
        .enough-page .cta-button .main-text {
          font-size: 1.3rem;
          font-weight: 600;
          display: block;
          margin-bottom: 4px;
        }
        .enough-page .cta-button .sub-text {
          font-size: 0.9rem;
          font-weight: 400;
          opacity: 0.9;
          display: block;
        }
        .enough-page .benefit-list,
        .enough-page .bullet-list {
          list-style: none;
          margin: 30px auto;
          max-width: 700px;
        }
        .enough-page .benefit-list li,
        .enough-page .bullet-list li {
          margin-bottom: 15px;
          padding-left: 30px;
          position: relative;
          font-size: 1.1rem;
          opacity: 0;
          transform: translateX(-20px);
          transition: all 0.6s ease;
        }
        .enough-page .benefit-list li.visible,
        .enough-page .bullet-list li.visible {
          opacity: 1;
          transform: translateX(0);
        }
        .enough-page .benefit-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #4caf50;
          font-weight: bold;
          font-size: 1.2rem;
        }
        .enough-page .bullet-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #d84315;
          font-weight: bold;
          font-size: 1.2rem;
        }
        .enough-page .testimonial {
          background: rgba(216, 67, 21, 0.1);
          padding: 25px;
          border-radius: 10px;
          margin: 25px auto;
          border-left: 4px solid #d84315;
          transition: all 0.3s ease;
          cursor: default;
          max-width: 700px;
        }
        .enough-page .testimonial:hover {
          background: rgba(216, 67, 21, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        .enough-page .section-dark .testimonial {
          background: rgba(216, 67, 21, 0.15);
        }
        .enough-page .section-dark .testimonial:hover {
          background: rgba(216, 67, 21, 0.2);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.1);
        }
        .enough-page .fade-in {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease;
        }
        .enough-page .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
        @media (max-width: 768px) {
          .enough-page .headline {
            font-size: 2.5rem;
          }
          .enough-page .subheadline {
            font-size: 2.2rem;
          }
          .enough-page .section-subhead {
            font-size: 1.9rem;
          }
          .enough-page .section {
            padding: 35px 0;
          }
          .enough-page .container {
            padding: 0 15px;
          }
          .enough-page .fade-in {
            transition: all 0.6s ease;
          }
          .enough-page .benefit-list li,
          .enough-page .bullet-list li {
            transition: all 0.4s ease;
          }
          .enough-page .cta-button {
            padding: 18px 35px;
          }
          .enough-page .cta-button .main-text {
            font-size: 1.2rem;
          }
        }
      `}</style>

      <header className="relative z-50 bg-white">
        <MainNav />
      </header>

      <main>
        <div className="section section-light">
        <div className="container">
          <img
            src="/image/enough.png"
            alt="Enough is Enough"
            className="w-full rounded-xl border border-gray-300 shadow-sm"
          />
        </div>
      </div>
        {/* SECTION 1 */}
        <section className="section section-light fade-in">
          <div className="container">
            <h1 className="headline">
              Finally! A 66-Year-Old Who&apos;s Actually Done It Shows You How to Stop
              Buying Courses and Start Getting Things{' '}
              <span className="highlight">WORKING Online in 7-14 Days</span>
            </h1>

            <h2 className="subheadline">
              If you&apos;re over 55 and sick of guru promises with nothing to show for it
              but a downloads folder full of PDFs you never opened... this is for you.
            </h2>

            <p className="body-text">Look, I&apos;m going to be brutally honest with you.</p>

            <p className="body-text">
              If you&apos;re reading this, you&apos;ve probably spent hundreds (maybe
              thousands) on courses, trainings, and &quot;secret systems&quot; that
              promised to help you build an online business.
            </p>

            <p className="body-text">
              And right now, you&apos;re sitting there with:
            </p>

            <ul className="bullet-list">
              <li>A credit card bill that makes you sick</li>
              <li>A downloads folder stuffed with PDFs you never opened</li>
              <li>Browser bookmarks to &quot;resources&quot; you&apos;ll never use</li>
              <li>
                That awful feeling in your gut that maybe you&apos;re just &quot;too
                old&quot; for this tech stuff
              </li>
            </ul>

            <p className="body-text">
              Meanwhile, every time you open Facebook or Instagram, another 25-year-old
              &quot;guru&quot; is trying to sell you their $997 course on how they made
              millions selling courses about making millions.
            </p>

            <p className="body-text">
              <strong>Enough is enough.</strong>
            </p>

            <p className="body-text">
              I&apos;m Dr. Mark Johnson. I&apos;m 66 years old, and I&apos;ve been building{' '}
              <strong>real</strong> online businesses since the early 1990s - back when we
              had to dial up to AOL and wait five minutes for a single photo to load.
            </p>

            <p className="body-text">
              I was consulting for iMall.com - the internet&apos;s first online shopping
              mall - before most of these &quot;gurus&quot; were even born.
            </p>

            <p className="body-text">And you know what?</p>

            <p className="body-text">
              <span className="conversion-bold">
                I&apos;m absolutely sick and tired of watching fellow seniors get ripped
                off by promise after promise with NOTHING to show for it.
              </span>
            </p>

            <button
              type="button"
              className="cta-button"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              <span className="main-text">
                {checkoutLoading ? 'Processing...' : 'Stop the Madness Now'}
              </span>
              <span className="sub-text">→ Get Something WORKING in 14 Days</span>
            </button>
          </div>
        </section>

        {/* SECTION 2 */}
        <section className="section section-alt-light fade-in">
          <div className="container">
            <h2 className="section-subhead">Here&apos;s What Nobody Else Will Tell You:</h2>

            <p className="body-text">
              <span className="conversion-bold">
                90–95% of seniors never see anything actually functioning online.
              </span>
            </p>

            <p className="body-text">Ever.</p>

            <p className="body-text">
              They watch hundreds of hours of YouTube videos. They buy course after course.
              They attend webinar after webinar.
            </p>

            <p className="body-text">But they never actually see:</p>

            <ul className="bullet-list">
              <li>A checkout page that processes real payments</li>
              <li>A product that customers can actually buy</li>
              <li>A website that looks professional and works properly</li>
              <li>An income stream that puts actual money in their bank account</li>
            </ul>

            <p className="body-text">Why?</p>

            <p className="body-text">
              Because <strong>implementation</strong> isn&apos;t sexy to sell. &quot;Secrets&quot;
              and &quot;systems&quot; and &quot;breakthrough methods&quot; - that&apos;s what
              sells courses.
            </p>

            <p className="body-text">
              But actually getting something set up correctly and working?
            </p>

            <p className="body-text">That&apos;s where the gurus abandon you.</p>
          </div>
        </section>

        {/* SECTION 3 */}
        <section className="section section-light fade-in">
          <div className="container">
            <h2 className="section-subhead">
              The Game-Changing Realization That Changes Everything
            </h2>

            <p className="body-text">
              After 30 years of trial and error, building successful businesses on Etsy,
              Shopify, Amazon, and more, I discovered something that would have saved me
              tens of thousands of dollars:
            </p>

            <p className="body-text">
              <span className="conversion-bold">
                You don&apos;t need to become an expert at everything. You just need to
                become expert at managing experts.
              </span>
            </p>

            <p className="body-text">Think about it...</p>

            <p className="body-text">
              Instead of spending $5,000 on courses trying to learn web design,
              copywriting, tech setup, and 47 other skills you&apos;ll never master...
            </p>

            <p className="body-text">
              What if you could spend $200 hiring the right experts to just... do it for
              you?
            </p>

            <p className="body-text">But here&apos;s the catch - and it&apos;s a big one:</p>

            <p className="body-text">
              <strong>
                Most seniors get completely ripped off when they try to hire freelancers.
              </strong>
            </p>

            <p className="body-text">
              Fake portfolios. Disappearing workers. AI-generated responses that sound good
              but deliver nothing. Projects that spiral out of control with no way to
              recover.
            </p>

            <p className="body-text">
              That&apos;s where my 30 years of expensive mistakes becomes your shortcut to
              success.
            </p>
          </div>
        </section>

        {/* SECTION 4 */}
        <section className="section section-dark fade-in">
          <div className="container">
            <h2 className="section-subhead">
              Introducing: The Holy Crap Implementation System™
            </h2>

            <p className="body-text">
              This isn&apos;t another course. It&apos;s not more theory. It&apos;s not
              another PDF for your downloads folder.
            </p>

            <p className="body-text">
              It&apos;s a battle-tested system that gets you from &quot;stuck and
              frustrated&quot; to &quot;holy crap, something&apos;s actually working!&quot; in
              7–14 days.
            </p>

            <p className="body-text">Here&apos;s what happens:</p>

            <ul className="benefit-list">
              <li>
                <strong>You pick your ONE thing</strong> (not five things, not your backup
                plan - ONE thing you actually want to get working online)
              </li>
              <li>
                <strong>You follow my exact freelancer vetting system</strong> (developed
                over 30 years of trial and error - this alone will save you thousands)
              </li>
              <li>
                <strong>You implement the daily check-in system</strong> that ensures
                projects stay on track and freelancers can&apos;t disappear with your money
              </li>
              <li>
                <strong>Within 7–14 days, you have something ACTUALLY FUNCTIONING</strong>{' '}
                instead of another course collecting digital dust
              </li>
            </ul>

            <p className="body-text">
              That moment when you see it working - when you realize &quot;Holy crap, I
              actually DID this!&quot; - that&apos;s when everything changes.
            </p>
          </div>
        </section>

        {/* SECTION 5 */}
        <section className="section section-alt-light fade-in">
          <div className="container">
            <h2 className="section-subhead">
              This Works Because It&apos;s Built for Seniors, BY a Senior Who&apos;s
              Actually Done It
            </h2>

            <p className="body-text">
              I&apos;m not some 25-year-old teaching theory. At 66, with a PhD and 30 years
              of real online business experience, I&apos;ve:
            </p>

            <ul className="bullet-list">
              <li>Built a profitable Etsy store (still running)</li>
              <li>Created a successful Shopify business</li>
              <li>
                Developed the 60something Type 2 Diabetes brand that&apos;s helped thousands
              </li>
              <li>Published multiple Amazon KDP books</li>
              <li>Created dozens of digital products that actually sell</li>
            </ul>

            <p className="body-text">
              <strong>
                And I did it all without being a &quot;tech wizard&quot; and without
                spending thousands on guru courses.
              </strong>
            </p>

            <p className="body-text">
              Now I&apos;m sharing the exact system that lets you bypass all the expensive
              mistakes I made and go straight to implementation.
            </p>

            <button
              type="button"
              className="cta-button"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              <span className="main-text">Show Me The System</span>
              <span className="sub-text">→ Finally Get Something WORKING</span>
            </button>
          </div>
        </section>

        {/* SECTION 6 */}
        <section className="section section-light fade-in">
          <div className="container">
            <h2 className="section-subhead">Here&apos;s What Makes This Different:</h2>

            <h3 className="section-subhead">You&apos;re Not Learning - You&apos;re DOING</h3>

            <p className="body-text">
              While everyone else is selling you more education, I&apos;m giving you
              implementation. You don&apos;t need another course on &quot;how to build a
              website.&quot; You need a website that actually works.
            </p>

            <h3 className="section-subhead">
              You&apos;re Not Starting from Scratch - You&apos;re Managing Success
            </h3>

            <p className="body-text">
              You already have a lifetime of experience managing projects and people. This
              system leverages those skills instead of forcing you to become someone
              you&apos;re not.
            </p>

            <h3 className="section-subhead">
              You&apos;re Getting Results in Days, Not Months
            </h3>

            <p className="body-text">
              7–14 days to see something functioning. Not &quot;learn for 12 weeks then
              maybe start.&quot; Not &quot;build your foundation for 6 months.&quot; Actual,
              working results you can see and touch.
            </p>
          </div>
        </section>

        {/* SECTION 7 */}
        <section className="section section-dark fade-in">
          <div className="container">
            <h2 className="section-subhead">What Other Seniors Are Experiencing:</h2>

            <div className="testimonial">
              <p className="body-text">
                <em>
                  &quot;After 18 months of buying courses, I finally have a checkout page
                  that actually processes payments. I tested it with my own credit card and
                  watched the money hit my account. This is REAL!&quot;
                </em>
              </p>
            </div>

            <div className="testimonial">
              <p className="body-text">
                <em>
                  &quot;The freelancer vetting system alone was worth everything. I went
                  from getting ripped off three times to finding someone who delivered
                  exactly what I needed for under $100.&quot;
                </em>
              </p>
            </div>

            <div className="testimonial">
              <p className="body-text">
                <em>
                  &quot;I spent $3,000 on guru courses with nothing to show for it. In 10
                  days with Mark&apos;s system, I had my first digital product live and
                  ready to sell. The &apos;holy crap&apos; moment is real!&quot;
                </em>
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 8 */}
        <section className="section section-alt-light fade-in">
          <div className="container">
            <h2 className="section-subhead">Warning: This is NOT for Everyone</h2>

            <p className="body-text">This system is specifically for:</p>

            <ul className="bullet-list">
              <li>Seniors 55+ who are FED UP with empty promises</li>
              <li>People who&apos;ve already bought courses but have zero implementation</li>
              <li>Those ready to STOP learning and START building</li>
              <li>Anyone who can follow a proven system without trying to reinvent it</li>
            </ul>

            <p className="body-text">This is NOT for:</p>

            <ul className="bullet-list">
              <li>People looking for &quot;get rich quick&quot; schemes</li>
              <li>Anyone who wants to keep buying courses instead of implementing</li>
              <li>Those who won&apos;t commit to 1–2 hours daily for 14 days</li>
              <li>People who can&apos;t invest $100–300 in proper implementation</li>
            </ul>
          </div>
        </section>

        {/* SECTION 9 */}
        <section className="section section-light fade-in">
          <div className="container">
            <h2 className="section-subhead">
              The Hidden Truth About Online Success After 55
            </h2>

            <p className="body-text">
              Here&apos;s what those young gurus don&apos;t understand about our generation:
            </p>

            <p className="body-text">
              We don&apos;t need more information. We need someone who understands our
              specific challenges and has already figured out the solutions.
            </p>

            <p className="body-text">
              We&apos;re not &quot;too old&quot; or &quot;not tech-savvy enough.&quot; We
              just need the right approach - one that leverages our strengths instead of
              highlighting our weaknesses.
            </p>

            <p className="body-text">
              <span className="conversion-bold">
                Most importantly: We need IMPLEMENTATION, not education.
              </span>
            </p>
          </div>
        </section>

        {/* SECTION 10 */}
        <section className="section section-dark fade-in">
          <div className="container">
            <h2 className="section-subhead">Here&apos;s Exactly What You Get:</h2>

            <h3 className="section-subhead">
              The Complete Holy Crap Implementation System™
            </h3>

            <p className="body-text">
              <strong>Module 1: The ONE Thing Focus Formula</strong>
            </p>
            <ul className="bullet-list">
              <li>
                The 4-step process that forces you to stop trying everything and pick the
                ONE thing that will actually work
              </li>
              <li>How to know if your idea is implementation-ready or needs adjustment</li>
              <li>The &quot;gut check&quot; questions that ensure you&apos;ll stick with it</li>
            </ul>

            <p className="body-text">
              <strong>Module 2: The 30-Year Freelancer Mastery Vault</strong>
            </p>
            <ul className="bullet-list">
              <li>My complete vetting system that spots fake freelancers immediately</li>
              <li>
                The 5 &quot;acid test&quot; questions that separate real experts from BS
                artists
              </li>
              <li>
                How to detect AI-generated responses (this epidemic is ripping off seniors
                daily)
              </li>
              <li>
                The exact interview process I use to find $100 talent that delivers $1,000
                value
              </li>
            </ul>

            <p className="body-text">
              <strong>Module 3: The Project Success System</strong>
            </p>
            <ul className="bullet-list">
              <li>Daily check-in templates that keep projects on track</li>
              <li>The communication system that prevents freelancers from disappearing</li>
              <li>How to structure payments so you never lose money</li>
              <li>Red flag alerts that stop disasters before they happen</li>
            </ul>

            <p className="body-text">
              <strong>Module 4: The 14-Day Implementation Roadmap</strong>
            </p>
            <ul className="bullet-list">
              <li>Day-by-day action steps from stuck to functioning</li>
              <li>Exactly what to do when things go wrong (and how to recover fast)</li>
              <li>The milestone system that guarantees progress</li>
              <li>Your &quot;holy crap&quot; moment checklist</li>
            </ul>

            <p className="body-text">
              <strong>Module 5: The Troubleshooting Toolkit</strong>
            </p>
            <ul className="bullet-list">
              <li>What to do when freelancers vanish (and how to prevent it)</li>
              <li>How to fix quality problems without starting over</li>
              <li>The &quot;project rescue&quot; system for when things go sideways</li>
              <li>Emergency protocols that save time and money</li>
            </ul>

            <h3 className="section-subhead">Plus These Exclusive Bonuses:</h3>

            <p className="body-text">
              <strong>Bonus #1: The Platform Quick-Start Guides</strong>
            </p>
            <p className="body-text">
              Exact setup instructions for Upwork and Fiverr that maximize your success
              while protecting your money
            </p>

            <p className="body-text">
              <strong>Bonus #2: The &quot;Good Freelancer&quot; Swipe File</strong>
            </p>
            <p className="body-text">
              Real examples of freelancer profiles, portfolios, and communications from
              verified experts
            </p>

            <p className="body-text">
              <strong>Bonus #3: The Cost Calculator Spreadsheet</strong>
            </p>
            <p className="body-text">
              Know exactly what each type of project should cost so you never overpay
              again
            </p>

            <button
              type="button"
              className="cta-button"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              <span className="main-text">
                {checkoutLoading ? 'Processing...' : 'Get The Complete System'}
              </span>
              <span className="sub-text">→ Implementation Starts Today</span>
            </button>
          </div>
        </section>

        {/* SECTION 11 */}
        <section className="section section-alt-light fade-in">
          <div className="container">
            <h2 className="section-subhead">Your Investment in Finally Getting Things DONE</h2>

            <p className="body-text">
              Look, you&apos;ve probably spent thousands on courses that taught you nothing
              but theory.
            </p>

            <p className="body-text">
              Guru programs that promised millions but delivered confusion.
            </p>

            <p className="body-text">
              YouTube videos that wasted hundreds of hours with nothing to show for it.
            </p>

            <p className="body-text">
              <strong>
                The Holy Crap Implementation System™ is different because it&apos;s not
                about learning - it&apos;s about DOING.
              </strong>
            </p>

            <p className="lead-text">Your investment today: Just $37</p>

            <p className="body-text">
              That&apos;s less than what most gurus charge for a single module of theory
              that won&apos;t help you implement anything.
            </p>

            <p className="body-text">And here&apos;s the thing...</p>

            <button
              type="button"
              className="cta-button"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              <span className="main-text">
                {checkoutLoading ? 'Processing...' : 'Get Started Today'}
              </span>
              <span className="sub-text">→ Stop Buying, Start Building</span>
            </button>
          </div>
        </section>

        {/* SECTION 12 */}
        <section className="section section-light fade-in">
          <div className="container">
            <h2 className="section-subhead">This is About More Than Money</h2>

            <p className="body-text">
              This is about proving to yourself (and maybe to others) that you&apos;re not
              &quot;too old&quot; for online business.
            </p>

            <p className="body-text">
              It&apos;s about finally seeing something YOU built actually working.
            </p>

            <p className="body-text">
              It&apos;s about that moment when you realize: &quot;Holy crap, I actually DID
              this!&quot;
            </p>

            <p className="body-text">
              Because once you have ONE thing working, everything changes. You can build on
              that success. You can expand. You can help others.
            </p>

            <p className="body-text">
              But it all starts with getting that first thing implemented.
            </p>
          </div>
        </section>

        {/* SECTION 13 */}
        <section className="section section-alt-light fade-in">
          <div className="container">
            <h2 className="section-subhead">The Harsh Reality Check</h2>

            <p className="body-text">
              Right now, while you&apos;re reading this, there are three things happening:
            </p>

            <ul className="benefit-list">
              <li>
                <strong>Another guru is crafting their next $997 course</strong> to sell you
                more dreams and theory
              </li>
              <li>
                <strong>Your downloads folder is getting dustier</strong> with courses
                you&apos;ll never implement
              </li>
              <li>
                <strong>Other seniors using my system are seeing things actually WORK</strong>{' '}
                for the first time
              </li>
            </ul>

            <p className="body-text">
              Every day you wait is another day stuck in the same frustrating cycle.
            </p>

            <p className="body-text">
              Another day of feeling like maybe this online thing just isn&apos;t for you.
            </p>

            <p className="body-text">
              Another day of watching others succeed while you&apos;re still &quot;learning.&quot;
            </p>

            <p className="body-text">
              <span className="conversion-bold">
                But what if 14 days from now, you had something actually functioning?
              </span>
            </p>

            <p className="body-text">
              What if two weeks from today, you could show someone your working website,
              your live product, your functioning business?
            </p>

            <p className="body-text">
              What if you finally broke free from the course-buying hamster wheel?
            </p>
          </div>
        </section>

        {/* SECTION 14 */}
        <section className="section section-dark fade-in">
          <div className="container">
            <h2 className="section-subhead">Look, I&apos;ll Be Straight With You...</h2>

            <p className="body-text">
              I&apos;m 66 years old. I&apos;ve been doing this for 30 years. I&apos;ve made
              every mistake, learned every lesson, and figured out what actually works.
            </p>

            <p className="body-text">
              I created this system because I&apos;m tired of watching seniors like us get
              ripped off by promises that never deliver.
            </p>

            <p className="body-text">You don&apos;t need another course.</p>

            <p className="body-text">You don&apos;t need to become a tech expert.</p>

            <p className="body-text">You don&apos;t need to spend thousands more dollars.</p>

            <p className="body-text">
              <strong>
                You just need someone who&apos;s actually done it to show you the exact
                steps to get something WORKING.
              </strong>
            </p>

            <p className="body-text">That&apos;s what this is.</p>
          </div>
        </section>

        {/* SECTION 15 */}
        <section className="section section-light fade-in">
          <div className="container">
            <h2 className="section-subhead">Your Two Choices Right Now</h2>

            <p className="body-text">
              <strong>Choice #1:</strong> Keep doing what you&apos;ve been doing. Buy
              another course. Watch more videos. Stay stuck in the same cycle, hoping
              something magically changes.
            </p>

            <p className="body-text">
              <strong>Choice #2:</strong> Try something different. Use a proven system
              built by someone who&apos;s actually done it. Get something functioning in
              the next 14 days. Experience your &quot;holy crap&quot; moment.
            </p>

            <p className="body-text">The choice is yours.</p>

            <p className="body-text">But let me ask you...</p>

            <p className="body-text">
              <strong>
                How many more courses do you need to buy before you realize courses
                aren&apos;t the answer?
              </strong>
            </p>

            <p className="body-text">
              <strong>
                How many more months will you stay stuck before you decide enough is
                enough?
              </strong>
            </p>

            <p className="body-text">
              <strong>
                How much longer will you let those 25-year-old gurus make you feel
                inadequate?
              </strong>
            </p>

            <p className="body-text">You know what you need to do.</p>

            <button
              type="button"
              className="cta-button"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              <span className="main-text">
                {checkoutLoading ? 'Processing...' : 'Stop the Madness Now'}
              </span>
              <span className="sub-text">→ Start Implementing Today</span>
            </button>
          </div>
        </section>

        {/* SECTION 16 */}
        <section className="section section-alt-light fade-in">
          <div className="container">
            <h2 className="section-subhead">One Final Thought...</h2>

            <p className="body-text">
              Somewhere in your downloads folder is a course you bought 6 months ago.
            </p>

            <p className="body-text">
              You were excited. This was going to be &quot;the one.&quot; The course that
              finally helped you breakthrough.
            </p>

            <p className="body-text">
              But here you are, still stuck, still searching, still hoping.
            </p>

            <p className="body-text">
              <span className="conversion-bold">
                What if instead of buying another course, you finally got that old idea
                IMPLEMENTED?
              </span>
            </p>

            <p className="body-text">
              What if 14 days from now, that idea you&apos;ve been sitting on was actually
              live and working?
            </p>

            <p className="body-text">That&apos;s the transformation I&apos;m offering.</p>

            <p className="body-text">
              Not more learning. Not more theory. Not more empty promises.
            </p>

            <p className="body-text">
              <strong>Just simple, step-by-step implementation that gets results.</strong>
            </p>

            <p className="body-text">Your &quot;holy crap&quot; moment is waiting.</p>

            <p className="body-text">
              The only question is: Are you ready to stop buying and start building?
            </p>

            <button
              type="button"
              className="cta-button"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              <span className="main-text">
                {checkoutLoading ? 'Processing...' : 'YES! Show Me How'}
              </span>
              <span className="sub-text">→ Get Something Working in 14 Days</span>
            </button>

            <p className="body-text" style={{ marginTop: 40 }}>
              To your implementation success,
            </p>

            <p className="body-text">
              <strong>Dr. Mark Johnson</strong>
              <br />
              <em>The 66-year-old who&apos;s tired of watching seniors get ripped off</em>
            </p>

            <p className="body-text" style={{ marginTop: 30, fontSize: '0.95rem' }}>
              <strong>P.S.</strong> Remember - this isn&apos;t about becoming someone
              you&apos;re not. You don&apos;t need to be &quot;tech-savvy&quot; or learn
              complex skills. You just need to know how to manage the right people to get
              the right results. After 30 years and countless mistakes, I&apos;ve figured
              out exactly how to do that. Now it&apos;s your turn.
            </p>

            <p className="body-text" style={{ fontSize: '0.95rem' }}>
              <strong>P.P.S.</strong> That course sitting in your downloads folder? It&apos;s
              not going to implement itself. Another YouTube video isn&apos;t going to
              magically make things click. At some point, you have to stop learning and
              start doing. Why not make that point today?
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

