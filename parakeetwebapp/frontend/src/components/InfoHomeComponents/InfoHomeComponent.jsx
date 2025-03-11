import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export default function InfoHomeComponent() {
  const mainRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroImageRef = useRef(null);
  const statsRef = useRef(null);
  const cardsRef = useRef(null);
  const cardRefs = useRef([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Hero section animations
    gsap.from(heroTextRef.current.children, {
      y: 50,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out"
    });

    gsap.from(heroImageRef.current, {
      x: 50,
      duration: 1,
      ease: "power3.out"
    });

    // Stats counter animation
    const statsElements = statsRef.current.querySelectorAll('.stat-number');
    statsElements.forEach((stat) => {
      const targetNumber = parseInt(stat.getAttribute('data-value'));
      gsap.to(stat, {
        textContent: targetNumber,
        duration: 2,
        ease: "power1.out",
        scrollTrigger: {
          trigger: stat,
          start: "top 80%",
        },
        snap: { textContent: 1 }
      });
    });

    // Cards animation
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach((card, index) => {
      gsap.from(card, {
        y: 50,
        duration: 0.8,
        delay: index * 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen bg-[#111111]">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center bg-[#111111]">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div ref={heroTextRef} className="space-y-6">
            <h1 className="text-7xl font-bold text-orange-500">
              Parakeet
            </h1>
            <p className="text-2xl text-white">
              Where Athletes and Opportunities Connect
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-orange-500 text-white rounded-full font-semibold hover:scale-105 transition-transform"
              onClick={() => navigate('/login')}>
                Get Started
              </button>
              <button className="px-8 py-4 border-2 border-purple-500 text-white rounded-full font-semibold hover:bg-purple-500 transition-all">
                Learn More
              </button>
            </div>
          </div>
          
          <div ref={heroImageRef} className="relative hidden lg:block">
            <div className="w-full h-[600px] rounded-2xl bg-[#1a1a1a]" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#161616]">
        <div ref={statsRef} className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-8 rounded-2xl bg-[#222222]">
            <div data-value="5000" className="stat-number text-5xl font-bold text-orange-500 mb-4">0</div>
            <p className="text-xl font-medium text-white">Athletes Connected</p>
          </div>
          <div className="p-8 rounded-2xl bg-[#222222]">
            <div data-value="1000" className="stat-number text-5xl font-bold text-purple-500 mb-4">0</div>
            <p className="text-xl font-medium text-white">Active Agents</p>
          </div>
          <div className="p-8 rounded-2xl bg-[#222222]">
            <div data-value="2500" className="stat-number text-5xl font-bold text-blue-500 mb-4">0</div>
            <p className="text-xl font-medium text-white">Successful Matches</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#111111]">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 text-orange-500">
            Why Choose Parakeet?
          </h2>
          
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Matching",
                description: "AI-powered algorithm connects athletes with the perfect representatives",
                icon: "🎯"
              },
              {
                title: "Verified Profiles",
                description: "All agents and athletes are thoroughly vetted and verified",
                icon: "✓"
              },
              {
                title: "Secure Communication",
                description: "End-to-end encrypted messaging and file sharing",
                icon: "🔒"
              },
              {
                title: "Career Analytics",
                description: "Track your progress and growth with detailed analytics",
                icon: "📈"
              },
              {
                title: "Global Network",
                description: "Connect with professionals from around the world",
                icon: "🌍"
              },
              {
                title: "24/7 Support",
                description: "Round-the-clock assistance for all your needs",
                icon: "💬"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="feature-card p-8 rounded-2xl bg-[#222222]"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#161616]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-8 text-white">Ready to Transform Your Career?</h2>
          <button className="px-12 py-6 bg-orange-500 text-white rounded-full font-bold text-xl hover:scale-105 transition-transform">
            Join Parakeet Today
          </button>
        </div>
      </section>
    </div>
  );
}
