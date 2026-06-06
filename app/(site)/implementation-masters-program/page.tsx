'use client';

import { useEffect, useState } from 'react';
import MainNav from '@/components/MainNav';

const IMPLEMENTATION_MASTERS_PRICE_ID =
  process.env.NEXT_PUBLIC_STRIPE_PRODUCT_IMPLEMENTATION_MASTERS ||
  'MISSING_PRICE_ID';

export default function ImplementationMastersProgramPage() {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = () => {
    if (!IMPLEMENTATION_MASTERS_PRICE_ID || IMPLEMENTATION_MASTERS_PRICE_ID === 'MISSING_PRICE_ID') {
      alert('Checkout is not configured yet. Please try again later.');
      return;
    }

    setCheckoutLoading(true);
    window.location.href = '/checkout?product=implementation-masters-program';
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

    document.querySelectorAll('.imp-masters-page .fade-in').forEach((el) => {
      observer.observe(el);
    });

    document
      .querySelectorAll(
        '.imp-masters-page .benefit-list li, .imp-masters-page .bullet-list li'
      )
      .forEach((li, index) => {
        (li as HTMLElement).style.animationDelay = `${(index % 6) * 0.1 + 0.1}s`;
        observer.observe(li);
      });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="imp-masters-page min-h-screen bg-white text-black">
   
      <style jsx global>{`
        .imp-masters-page {
          font-family: 'Source Sans 3', system-ui, -apple-system, BlinkMacSystemFont,
            'Segoe UI', sans-serif;
          line-height: 1.65;
          color: #333333;
        }
        .imp-masters-page .section {
          padding: 50px 0;
          position: relative;
        }
        .imp-masters-page .section-light {
          background-color: #ffffff;
          color: #333333;
        }
        .imp-masters-page .section-dark {
          background-color: #ffffff;
          color: #000000;
        }
        .imp-masters-page .section-alt-light {
          background-color: #f7f7f7;
          color: #333333;
        }
        .imp-masters-page .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .imp-masters-page .headline {
          font-family: 'Lora', serif;
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 30px;
          text-align: center;
        }
        .imp-masters-page .subheadline {
          font-family: 'Lora', serif;
          font-size: 2.6rem;
          font-weight: 600;
          line-height: 1.2;
          margin-bottom: 25px;
          text-align: center;
        }
        .imp-masters-page .section-subhead {
          font-family: 'Lora', serif;
          font-size: 2.3rem;
          font-weight: 600;
          line-height: 1.3;
          margin: 35px 0 20px 0;
          color: #d84315;
          text-align: center;
        }
        .imp-masters-page .body-text {
          font-size: 1.1rem;
          margin-bottom: 20px;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.65;
        }
        .imp-masters-page .lead-text {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 30px;
          max-width: 650px;
          text-align: center;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.4;
        }
        .imp-masters-page .highlight {
          color: #d84315;
        }
        .imp-masters-page .conversion-bold {
          font-weight: 600;
          color: #d84315;
        }
        .imp-masters-page .cta-button {
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
        .imp-masters-page .cta-button:hover {
          background-color: #d84315;
          filter: brightness(0.9);
          transform: translateY(-2px);
        }
        .imp-masters-page .cta-button .main-text {
          font-size: 1.3rem;
          font-weight: 600;
          display: block;
          margin-bottom: 4px;
        }
        .imp-masters-page .cta-button .sub-text {
          font-size: 0.9rem;
          font-weight: 400;
          opacity: 0.9;
          display: block;
        }
        .imp-masters-page .benefit-list,
        .imp-masters-page .bullet-list {
          list-style: none;
          margin: 30px auto;
          max-width: 700px;
        }
        .imp-masters-page .benefit-list li,
        .imp-masters-page .bullet-list li {
          margin-bottom: 15px;
          padding-left: 30px;
          position: relative;
          font-size: 1.1rem;
          opacity: 0;
          transform: translateX(-20px);
          transition: all 0.6s ease;
        }
        .imp-masters-page .benefit-list li.visible,
        .imp-masters-page .bullet-list li.visible {
          opacity: 1;
          transform: translateX(0);
        }
        .imp-masters-page .benefit-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #4caf50;
          font-weight: bold;
          font-size: 1.2rem;
        }
        .imp-masters-page .bullet-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #d84315;
          font-weight: bold;
          font-size: 1.2rem;
        }
        .imp-masters-page .testimonial {
          background: rgba(216, 67, 21, 0.1);
          padding: 25px;
          border-radius: 10px;
          margin: 25px auto;
          border-left: 4px solid #d84315;
          transition: all 0.3s ease;
          cursor: default;
          max-width: 700px;
        }
        .imp-masters-page .testimonial:hover {
          background: rgba(216, 67, 21, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        .imp-masters-page .section-dark .testimonial {
          background: rgba(216, 67, 21, 0.15);
        }
        .imp-masters-page .section-dark .testimonial:hover {
          background: rgba(216, 67, 21, 0.2);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.1);
        }
        .imp-masters-page .fade-in {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease;
        }
        .imp-masters-page .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
        @media (max-width: 768px) {
          .imp-masters-page .headline {
            font-size: 2.5rem;
          }
          .imp-masters-page .subheadline {
            font-size: 2.2rem;
          }
          .imp-masters-page .section-subhead {
            font-size: 1.9rem;
          }
          .imp-masters-page .section {
            padding: 35px 0;
          }
          .imp-masters-page .container {
            padding: 0 15px;
          }
          .imp-masters-page .fade-in {
            transition: all 0.6s ease;
          }
          .imp-masters-page .benefit-list li,
          .imp-masters-page .bullet-list li {
            transition: all 0.4s ease;
          }
          .imp-masters-page .cta-button {
            padding: 18px 35px;
          }
          .imp-masters-page .cta-button .main-text {
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
            src="/image/master.png"
            alt="Implementation Masters Program"
            className="w-full rounded-xl border border-gray-300 shadow-sm"
          />
        </div>
      </div>

        {/* SECTION 1: Opening Hook */}
        <section className="section section-light fade-in">
          <div className="container">
            <h1 className="headline">
              Before You Go: A Quick Note About{' '}
              <span className="highlight">What Happens Next</span>
            </h1>

            <p className="lead-text">
              <strong>
                Congratulations on securing &quot;Enough is Enough - The Holy Crap - Online
                Implementation Breakthroughs For Seniors!&quot;
              </strong>
            </p>

            <p className="body-text">
              You just made a decision that 95% of people your age never make. Instead of
              buying another course that&apos;ll collect digital dust, you invested in
              actually getting something <strong>implemented and working</strong>.
            </p>

            <p className="body-text">
              That takes guts. And it tells me something important about you.
            </p>

            <p className="body-text">
              You&apos;re done with the BS. Done with the gurus. Done with learning theory
              that never turns into anything real.
            </p>

            <p className="body-text">You want results. And you&apos;re about to get them.</p>

            <p className="body-text">
              But before you dive into implementing your ONE thing, I need to share
              something with you...
            </p>

            <button
              type="button"
              className="cta-button"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              <span className="main-text">
                {checkoutLoading ? 'Processing...' : 'Yes! Add The Team System'}
              </span>
              <span className="sub-text">→ Build Complete Implementation Capability</span>
            </button>
          </div>
        </section>

        {/* SECTION 2: The Success Vision */}
        <section className="section section-alt-light fade-in">
          <div className="container">
            <h2 className="subheadline">
              Here&apos;s What&apos;s Going to Happen in the Next{' '}
              <span className="highlight">7-14 Days</span>
            </h2>

            <p className="body-text">
              You&apos;re going to follow the system. You&apos;re going to pick your ONE
              thing. You&apos;re going to use my 30-year vetting process to find a reliable
              freelancer. You&apos;re going to manage that project to completion.
            </p>

            <p className="body-text">
              And then... <strong>holy crap, something&apos;s actually working.</strong>
            </p>

            <p className="body-text">
              Your checkout page processes payments. Or your website goes live. Or your
              digital product is ready to sell. Whatever your ONE thing is - it&apos;s
              functioning instead of sitting in your downloads folder.
            </p>

            <p className="body-text">
              That feeling? Pure gold. You&apos;ll finally prove to yourself that you&apos;re
              not &quot;too old&quot; or &quot;too tech-challenged&quot; for this online
              thing.
            </p>

            <p className="body-text">
              But here&apos;s what I&apos;ve learned after helping seniors like you for 30
              years:
            </p>

            <p className="body-text">
              <span className="conversion-bold">
                The moment you successfully implement one thing, you&apos;re going to want
                to implement two, three, four more things.
              </span>
            </p>

            <p className="body-text">
              You&apos;re going to look at all those other ideas you&apos;ve been sitting on
              and think: &quot;Wait, I could actually DO those now.&quot;
            </p>

            <p className="body-text">
              And that&apos;s when a new question hits you:
            </p>

            <p className="body-text">
              <em>
                &quot;Do I really have to go through this entire vetting process again... for
                every single project?&quot;
              </em>
            </p>
          </div>
        </section>

        {/* SECTION 3: The Problem Intensifies */}
        <section className="section section-dark fade-in">
          <div className="container">
            <h2 className="subheadline">
              The Exhausting Reality of{' '}
              <span className="highlight">One-Project-at-a-Time</span>
            </h2>

            <p className="body-text">
              I&apos;ll tell you exactly what happens if you don&apos;t address this:
            </p>

            <p className="body-text">
              You&apos;ll implement Project #1 successfully. Awesome.
            </p>

            <p className="body-text">
              Then you&apos;ll want to tackle Project #2. But that means finding a NEW
              freelancer, going through the WHOLE vetting process again, managing another
              stranger through completion...
            </p>

            <p className="body-text">Then Project #3. Same thing. Start from scratch.</p>

            <p className="body-text">Project #4. Repeat.</p>

            <p className="body-text">Every. Single. Time.</p>

            <p className="body-text">
              After about project #3, most people start burning out. The vetting process
              that worked great once starts feeling exhausting when you&apos;re doing it
              over and over. Projects take forever because you&apos;re always starting with
              strangers who don&apos;t know your standards.
            </p>

            <p className="body-text">
              I made this mistake for YEARS before I figured out a better approach.
            </p>

            <p className="body-text">
              See, I treated every project like a separate adventure. Need a designer? Go
              find one. Need a writer? Start the search again. Need tech help? Hope you
              find someone good this time.
            </p>

            <p className="body-text">
              <span className="conversion-bold">
                It was like shopping for all new ingredients every time I wanted to cook
                dinner. Exhausting and completely unnecessary.
              </span>
            </p>
          </div>
        </section>

        {/* SECTION 4: The Solution Story */}
        <section className="section section-light fade-in">
          <div className="container">
            <h2 className="subheadline">
              What Changed <span className="highlight">Everything</span> for Me
            </h2>

            <p className="body-text">
              The breakthrough came when I stopped treating freelancers as one-off
              transactions and started <strong>building a reliable team.</strong>
            </p>

            <p className="body-text">
              Instead of finding a new designer for every project, I found ONE great
              designer and kept working with her. Same for writing. Same for tech setup.
              Same for every specialty I regularly needed.
            </p>

            <p className="body-text">Suddenly, I wasn&apos;t starting from zero every time.</p>

            <p className="body-text">
              When I needed design work, I&apos;d message Sarah. She already knew my style,
              my standards, and how I like to communicate. Project started within 24 hours
              instead of 5 days of searching and vetting.
            </p>

            <p className="body-text">
              When I needed content written, I&apos;d reach out to Jennifer. She knew my
              audience, my voice, and what quality looked like for my brand. No explaining
              everything from scratch.
            </p>

            <p className="body-text">
              When something technical needed configuring, David already understood my
              systems. He could jump in immediately without a week of orientation.
            </p>

            <p className="body-text">
              <span className="conversion-bold">
                That&apos;s when implementation stopped being exhausting and started
                feeling almost automatic.
              </span>
            </p>

            <p className="body-text">
              Not because I got smarter or worked harder. Because I built a team of 3–5
              reliable specialists who were ready to tackle whatever I needed.
            </p>
          </div>
        </section>

        {/* SECTION 5: The Product Introduction */}
        <section className="section section-alt-light fade-in">
          <div className="container">
            <h2 className="subheadline">The Implementation Masters Program™</h2>

            <p className="body-text">
              I&apos;ve taken everything I learned over 30 years of building and managing
              freelancer teams and put it into a complete system you can implement
              alongside what you just purchased.
            </p>

            <p className="lead-text">
              <strong>
                The Implementation Masters Program™ - Your Complete Freelancer Team System
              </strong>
            </p>

            <p className="body-text">
              This extends the exact same approach you&apos;re about to use for your first
              implementation - but applied strategically to build a complete team
              capability.
            </p>

            <p className="body-text">
              You&apos;re not learning something new. You&apos;re optimizing what
              you&apos;ve already committed to.
            </p>

            <p className="body-text">Here&apos;s what the program delivers:</p>

            <ul className="benefit-list">
              <li>
                <strong>The Freelancer Team Mastery System™</strong> - The complete
                framework for building a reliable roster of 3–5 specialists who know you,
                understand your standards, and are ready to implement whatever you need.
                Reduces project startup time by 80% because you&apos;re never starting from
                scratch again.
              </li>
              <li>
                <strong>The Multi-Project Management Framework</strong> - How to manage 2–5
                simultaneous projects without chaos using simple tracking that takes 20–30
                minutes per day. No fancy software needed - just proven methods that keep
                everything moving smoothly while you stay in control.
              </li>
              <li>
                <strong>The Freelancer Roster System</strong> - The organized approach to
                maintaining your team&apos;s contact info, rates, availability, and
                strengths. When you need design work, you immediately know your primary and
                backup designers. Same for every specialty. No more searching through old
                messages trying to remember how to reach someone.
              </li>
              <li>
                <strong>Cost Optimization Through Relationships</strong> - Strategies for
                getting better rates and priority service from your team members - not
                through aggressive negotiation, but through the natural advantages of being
                a valued repeat client. Most people see 20–40% cost reduction over time
                while quality improves.
              </li>
              <li>
                <strong>The Project Prioritization Protocol</strong> - The decision
                framework for choosing which projects to implement when you have more ideas
                than time or budget. Stops the shiny object syndrome before it starts and
                keeps you focused on the right things in the right order.
              </li>
              <li>
                <strong>Advanced Vetting for Specialized Skills</strong> - Methods for
                identifying truly skilled technical specialists versus people who just talk
                a good game. Prevents expensive mistakes on complex work where you can&apos;t
                evaluate the quality yourself.
              </li>
              <li>
                <strong>Complete Troubleshooting Solutions</strong> - Proven approaches for
                handling every common team challenge - silent freelancers, quality issues,
                missed deadlines, scope creep. When problems emerge, you&apos;ll know
                exactly how to handle them professionally.
              </li>
            </ul>

            <button
              type="button"
              className="cta-button"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              <span className="main-text">
                {checkoutLoading ? 'Processing...' : 'Add This To My Order Now'}
              </span>
              <span className="sub-text">→ Complete Team System for Just $27</span>
            </button>
          </div>
        </section>

        {/* SECTION 6: The Transformation */}
        <section className="section section-dark fade-in">
          <div className="container">
            <h2 className="subheadline">
              What This Means <span className="highlight">for You</span>
            </h2>

            <p className="body-text">
              Once you&apos;ve built your team using this system:
            </p>

            <ul className="bullet-list">
              <li>
                <strong>New project ideas don&apos;t mean weeks of searching and vetting.</strong>{' '}
                You message your roster and have specialists working within 24–48 hours.
              </li>
              <li>
                <strong>Multiple projects move forward simultaneously</strong> instead of
                waiting in line behind each other.
              </li>
              <li>
                <strong>Costs go down over time</strong> as your team members offer
                preferred pricing to keep you as a reliable client.
              </li>
              <li>
                <strong>Quality improves</strong> because your specialists learn your
                standards and deliver exactly what you need without constant hand-holding.
              </li>
              <li>
                <strong>Implementation becomes almost automatic.</strong> You&apos;re not
                figuring things out each time - you&apos;re executing proven processes with
                proven people.
              </li>
            </ul>

            <p className="body-text">
              You&apos;ll go from &quot;I proved I can implement one thing&quot; to &quot;I
              can implement anything I want, whenever I want.&quot;
            </p>

            <p className="body-text">
              That&apos;s not hype. That&apos;s just what happens when you build a reliable
              team instead of treating every project like starting from scratch.
            </p>
          </div>
        </section>

        {/* SECTION 7: Two Paths Decision */}
        <section className="section section-light fade-in">
          <div className="container">
            <h2 className="subheadline">
              Two Paths <span className="highlight">Forward</span>
            </h2>

            <p className="body-text">You have a choice right now:</p>

            <h3 className="section-subhead">Path One: Single-Project Approach</h3>

            <p className="body-text">
              You implement your first project using what you just purchased. Great. Then
              when you want project #2, you start the vetting process over. And again for
              project #3. Each project is its own isolated effort.
            </p>

            <p className="body-text">
              This works. I did it this way for years. But it&apos;s exhausting and slow.
            </p>

            <h3 className="section-subhead">Path Two: Complete Team Approach</h3>

            <p className="body-text">
              You implement your first project AND build your team simultaneously. By the
              time your first project is done, you&apos;ve also got 3–5 reliable specialists
              on your roster ready for the next one.
            </p>

            <p className="body-text">
              Projects #2, #3, #4 start almost immediately instead of weeks of searching.
              You build momentum instead of constantly resetting to zero.
            </p>

            <p className="body-text">
              <span className="conversion-bold">
                This is the approach that transformed my implementation capability after 30
                years of trial and error.
              </span>
            </p>

            <button
              type="button"
              className="cta-button"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              <span className="main-text">
                {checkoutLoading ? 'Processing...' : 'Choose Complete Capability'}
              </span>
              <span className="sub-text">→ Build Your Team Starting Today</span>
            </button>
          </div>
        </section>

        {/* SECTION 8: Investment */}
        <section className="section section-alt-light fade-in">
          <div className="container">
            <h2 className="subheadline">
              Your <span className="highlight">Investment</span>
            </h2>

            <p className="body-text">
              The Implementation Masters Program™ is <strong>$27</strong>.
            </p>

            <p className="body-text">
              That&apos;s what you&apos;d probably spend on two hours of some random
              freelancer&apos;s time - except this gives you the complete system for
              building and managing your own implementation team forever.
            </p>

            <p className="body-text">
              More importantly, it&apos;s the logical extension of what you just purchased.
              You&apos;ve already decided to stop buying courses and start implementing.
              This ensures your implementation capability keeps growing project after
              project instead of plateauing after your first success.
            </p>
          </div>
        </section>

        {/* SECTION 9: Qualification */}
        <section className="section section-dark fade-in">
          <div className="container">
            <h2 className="subheadline">This is For You If:</h2>

            <ul className="bullet-list">
              <li>
                You have multiple project ideas you want to implement, not just one
              </li>
              <li>
                You&apos;d rather build a reliable team once than vet new freelancers every
                single time
              </li>
              <li>
                You want implementation to get easier over time, not stay equally
                effortful
              </li>
              <li>You&apos;re ready for complete mastery, not just basic capability</li>
            </ul>

            <h2 className="subheadline" style={{ marginTop: 40 }}>
              This is NOT For You If:
            </h2>

            <ul className="bullet-list">
              <li>
                You only have one thing you ever want to implement and no future project
                ideas
              </li>
              <li>
                You prefer starting from scratch every time (some people genuinely do)
              </li>
              <li>
                You&apos;re not planning to be active with online implementation beyond
                this first project
              </li>
            </ul>
          </div>
        </section>

        {/* SECTION 10: Guarantee and Close */}
        <section className="section section-light fade-in">
          <div className="container">
            <h2 className="subheadline">
              My <span className="highlight">Guarantee</span>
            </h2>

            <p className="body-text">
              This program builds directly on what you just purchased. It uses the same
              vetting skills, the same management approach, the same freelancer platforms.
              You&apos;re extending what works, not learning something completely
              different.
            </p>

            <p className="body-text">
              If you successfully complete your first implementation using the main
              product, you have every skill needed to build your team using this program.
            </p>

            <p className="body-text">
              I&apos;ve been doing this for 30 years. The team approach is what separates
              people who stay stuck at one project from people who can confidently
              implement anything.
            </p>

            <button
              type="button"
              className="cta-button"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              <span className="main-text">
                {checkoutLoading
                  ? 'Processing...'
                  : 'YES! Add The Implementation Masters Program™'}
              </span>
              <span className="sub-text">→ Complete Team System Added for $27</span>
            </button>

            <p className="body-text" style={{ textAlign: 'center', marginTop: 30, fontStyle: 'italic' }}>
              Complete team-building system added to your purchase. Start building your
              roster alongside your first implementation.
            </p>

            <p className="body-text" style={{ textAlign: 'center', marginTop: 40, marginBottom: 40 }}>
              ───────────
            </p>

            <button
              type="button"
              className="cta-button"
              style={{ backgroundColor: '#666666' }}
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              <span className="main-text">
                {checkoutLoading ? 'Processing...' : "No Thanks, I'll Figure It Out Later"}
              </span>
              <span className="sub-text">→ Continue to Original Purchase</span>
            </button>

            <p className="body-text" style={{ textAlign: 'center', marginTop: 30, fontStyle: 'italic' }}>
              You&apos;ll continue to your original purchase. The Implementation Masters
              Program™ won&apos;t be available at this price after you leave this page.
            </p>

            <p className="body-text">
              Look, you&apos;ve already proven you&apos;re serious by making this purchase.
              You&apos;re not like the people who just buy courses and never implement
              anything.
            </p>

            <p className="body-text">
              This is simply the logical next step - building complete capability rather
              than stopping at basic capability.
            </p>

            <p className="body-text">
              Either way, you&apos;re going to get your first thing implemented. I&apos;m
              excited for your &quot;holy crap&quot; moment.
            </p>

            <p className="body-text">
              But if you want that moment to be the first of many instead of an isolated
              success... the team system is how you make that happen.
            </p>

            <p className="body-text">Badda bing.</p>

            <p className="body-text" style={{ marginTop: 40 }}>
              <strong>Dr. Mark Johnson</strong>
            </p>
            <p className="body-text" style={{ fontStyle: 'italic' }}>
              The 66-year-old who&apos;s been building freelancer teams since before most
              gurus were born
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

