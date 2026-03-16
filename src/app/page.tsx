"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Flame,
  Users,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PlanetIcon } from "@/components/ui/PlanetIcon";
import { PRICING_PLANS } from "@/lib/constants";
import dynamic from "next/dynamic";

const Planet = dynamic(() => import("@/components/Planet"), { ssr: false });

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
              <PlanetIcon size={28} />
            </div>
            <span className="font-serif text-xl">Hosmos</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#standards" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Standards</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/wizard">
              <Button size="sm">Start Free <ArrowRight size={14} className="ml-1" /></Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <motion.div className="max-w-4xl mx-auto text-center" initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold">
              <Zap size={14} /> CSRD-ready in 30 minutes
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-serif text-gray-900 mb-6 leading-tight">
            ESG reporting for SMEs,<br />
            <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">simplified.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Calculate Scope 1/2/3 emissions, manage 100+ ESG parameters, and auto-generate reports compliant with CSRD, GRI, and CDP. From EUR 20/month.
          </motion.p>
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4">
            <Link href="/wizard">
              <Button size="lg">Start Free Trial <ArrowRight size={18} className="ml-2" /></Button>
            </Link>
            <Link href="#features">
              <Button variant="secondary" size="lg">See How It Works</Button>
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> 30-day free trial</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> GDPR compliant</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Planet Hero Visual */}
      <section className="px-6 pb-8 -mt-6">
        <div className="max-w-5xl mx-auto">
          <Planet />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-4xl font-serif text-gray-900 mb-4">Everything you need for ESG compliance</motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-gray-500 max-w-xl mx-auto">Seven modules covering the full E, S, and G spectrum</motion.p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Flame, title: "Carbon & Environment", desc: "Scope 1/2/3 calculation with GHG Protocol. DEFRA + IEA emission factors.", tag: "E", color: "blue" },
              { icon: Users, title: "People & Social", desc: "40 social parameters: workforce, gender balance, pay equity, training.", tag: "S", color: "violet" },
              { icon: Shield, title: "Governance", desc: "25 governance parameters: board composition, ethics, compliance.", tag: "G", color: "blue" },
              { icon: FileText, title: "Report Engine", desc: "Auto-generated GRI, ESRS, CDP, UN GC reports. PDF/Excel/JSON export.", tag: "R", color: "violet" },
              { icon: Globe, title: "Supply Chain Hub", desc: "Send ESG questionnaires to suppliers. Auto-calculate Scope 3 Cat.1.", tag: "SC", color: "blue" },
              { icon: BarChart3, title: "OKR & Goals", desc: "SBTi-aligned reduction targets. Net-zero timeline with milestones.", tag: "OKR", color: "violet" },
            ].map((feature) => (
              <motion.div key={feature.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-xl ${feature.color === "blue" ? "bg-blue-50" : "bg-violet-50"}`}>
                    <feature.icon size={20} className={feature.color === "blue" ? "text-blue-500" : "text-violet-500"} />
                  </div>
                  <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{feature.tag}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Standards */}
      <section id="standards" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-serif text-gray-900 mb-4">Built for EU compliance</h2>
          <p className="text-lg text-gray-500 mb-12">Full coverage of major ESG reporting standards</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "CSRD / ESRS", desc: "Full E1 climate" },
              { name: "GRI 2021", desc: "300 + 400 series" },
              { name: "CDP Climate", desc: "Sections C1-C12" },
              { name: "UN Global Compact", desc: "10 principles" },
              { name: "EU Taxonomy", desc: "Art. 8 disclosure" },
              { name: "TCFD", desc: "4 pillars" },
              { name: "SBTi", desc: "Target setting" },
              { name: "ISO 14001", desc: "EMS checklist" },
            ].map((std) => (
              <div key={std.name} className="p-5 bg-gray-50 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-all">
                <p className="font-semibold text-gray-900 text-sm">{std.name}</p>
                <p className="text-xs text-gray-400 mt-1">{std.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-gray-500">Start free. Upgrade when you&apos;re ready.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING_PLANS.map((plan) => (
              <div key={plan.id} className={`bg-white rounded-2xl p-6 border transition-all hover:shadow-lg ${plan.popular ? "border-blue-300 shadow-md ring-1 ring-blue-200" : "border-gray-100"}`}>
                {plan.popular && <span className="inline-block text-[10px] font-semibold bg-blue-500 text-white px-2.5 py-0.5 rounded-full mb-3">MOST POPULAR</span>}
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2 mb-4">
                  <span className="text-4xl font-serif text-gray-900">{plan.price === 0 ? "Free" : `€${plan.price}`}</span>
                  {plan.price > 0 && <span className="text-sm text-gray-400">{plan.period}</span>}
                </div>
                <p className="text-sm text-gray-500 mb-6">{plan.description}</p>
                <Link href="/wizard">
                  <Button variant={plan.popular ? "primary" : "secondary"} className="w-full mb-6">{plan.cta}</Button>
                </Link>
                <ul className="space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 size={15} className="text-green-500 mt-0.5 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-serif text-gray-900 mb-4">Ready to get CSRD-compliant?</h2>
          <p className="text-lg text-gray-500 mb-8">Join 300+ SMEs already using Hosmos to manage their ESG data.</p>
          <Link href="/wizard">
            <Button size="lg">Start Your Free Trial <ChevronRight size={18} className="ml-1" /></Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden">
              <PlanetIcon size={24} />
            </div>
            <span className="font-serif text-lg">Hosmos</span>
            <span className="text-xs text-gray-400 ml-2">by HelpH D.O.O.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms & Privacy</Link>
            <a href="#" className="hover:text-gray-600 transition-colors">Contact</a>
            <span>&copy; 2025 Hosmos</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
