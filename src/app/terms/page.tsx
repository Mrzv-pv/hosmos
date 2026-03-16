"use client";

import Link from "next/link";
import { Globe, ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
              <Globe size={18} className="text-white" />
            </div>
            <span className="font-serif text-xl">Hosmos</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-28 pb-20 px-6">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            Terms & Privacy
          </h1>
          <p className="text-sm text-gray-400 mb-8">
            Last updated: March 15, 2025 &middot; Effective date: March 15, 2025
          </p>

          {/* Quick nav */}
          <div className="flex gap-3 mb-12">
            <a href="#terms" className="px-4 py-2 rounded-lg bg-blue-50 text-[var(--blue-primary)] text-sm font-semibold hover:bg-blue-100 transition-colors">
              Terms of Service
            </a>
            <a href="#privacy" className="px-4 py-2 rounded-lg bg-violet-50 text-[var(--violet-primary)] text-sm font-semibold hover:bg-violet-100 transition-colors">
              Privacy Policy
            </a>
          </div>

          <div id="terms" className="scroll-mt-24" />

          {/* 1. Acceptance */}
          <Section number="1" title="Acceptance of Terms">
            <p>
              By accessing or using the Hosmos platform (&quot;Platform&quot;),
              operated by HelpH D.O.O., a company incorporated in Slovenia
              (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;), you
              (&quot;User&quot;, &quot;you&quot;) agree to be bound by these
              Terms of Service (&quot;Terms&quot;). If you do not agree, you
              must discontinue use of the Platform immediately.
            </p>
            <p>
              These Terms constitute a legally binding agreement between you and
              the Company. By creating an account, completing the onboarding
              wizard, or subscribing to any plan, you confirm that you have
              read, understood, and accepted these Terms in their entirety.
            </p>
          </Section>

          {/* 2. Description of Service */}
          <Section number="2" title="Description of Service">
            <p>
              Hosmos is a B2B SaaS platform designed for small and medium-sized
              enterprises (SMEs) to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mt-3">
              <li>
                Calculate greenhouse gas emissions across Scope 1, Scope 2, and
                Scope 3 (GHG Protocol)
              </li>
              <li>
                Manage up to 100+ non-financial ESG parameters (Environment,
                Social, Governance)
              </li>
              <li>
                Auto-generate compliance reports aligned with CSRD/ESRS, GRI
                2021, CDP Climate, UN Global Compact, EU Taxonomy, TCFD, and
                SBTi standards
              </li>
              <li>
                Manage supply chain ESG questionnaires and track
                decarbonisation goals
              </li>
            </ul>
            <p className="mt-3">
              Feature availability depends on the subscription tier selected by
              the User (Trial, Starter, Pro, or Enterprise).
            </p>
          </Section>

          {/* 3. Account Registration */}
          <Section number="3" title="Account Registration">
            <p>
              To use the Platform, you must create an account by providing
              accurate and complete information. You are responsible for
              maintaining the confidentiality of your login credentials and for
              all activities that occur under your account.
            </p>
            <p>
              You must notify us immediately at{" "}
              <a
                href="mailto:support@hosmos.io"
                className="text-[var(--blue-primary)] hover:underline"
              >
                support@hosmos.io
              </a>{" "}
              if you suspect any unauthorised access to your account.
            </p>
          </Section>

          {/* 4. Subscription Plans and Pricing */}
          <Section number="4" title="Subscription Plans and Pricing">
            <p>
              Hosmos offers the following subscription tiers: Trial (free, 30
              days), Starter (EUR 20/month), Pro (EUR 100/month), and
              Enterprise (custom pricing). All prices are exclusive of
              applicable taxes unless stated otherwise.
            </p>

            <h4 className="text-base font-semibold text-gray-900 mt-6 mb-2">
              4.1 Right to Modify Pricing
            </h4>
            <p>
              The Company reserves the right to modify subscription prices,
              features included in each tier, and the structure of pricing plans
              at any time. Such changes may include, but are not limited to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mt-2">
              <li>
                Adjusting monthly or annual subscription fees for any or all
                tiers
              </li>
              <li>
                Adding, removing, or reassigning features between tiers
              </li>
              <li>
                Introducing new pricing tiers or discontinuing existing ones
              </li>
              <li>
                Applying surcharges for premium features, add-ons, or
                increased usage
              </li>
            </ul>

            <h4 className="text-base font-semibold text-gray-900 mt-6 mb-2">
              4.2 Notice of Price Changes
            </h4>
            <p>
              We will provide at least <strong>30 days&apos; prior written notice</strong>{" "}
              of any pricing changes via email to the address associated with
              your account. The notice will specify the new pricing, the
              effective date, and any changes to tier features.
            </p>

            <h4 className="text-base font-semibold text-gray-900 mt-6 mb-2">
              4.3 Effect of Price Changes
            </h4>
            <p>
              Price changes will take effect at the start of the next billing
              cycle following the 30-day notice period. Your continued use of
              the Platform after the effective date constitutes acceptance of
              the new pricing. If you do not agree with the new pricing, you
              may cancel your subscription before the effective date without
              penalty.
            </p>

            <h4 className="text-base font-semibold text-gray-900 mt-6 mb-2">
              4.4 Billing and Payment
            </h4>
            <p>
              Subscriptions are billed monthly or annually in advance via
              Stripe. Failed payments will result in a grace period of 7 days,
              after which your account may be downgraded to Trial functionality
              until payment is resolved.
            </p>
          </Section>

          {/* 5. Free Trial */}
          <Section number="5" title="Free Trial">
            <p>
              New users receive a 30-day free trial with access to Scope 1 and
              Scope 2 calculation, the onboarding wizard, and a single PDF
              report export. No credit card is required to start a trial.
            </p>
            <p>
              At the end of the trial period, your account will be limited to
              read-only access. To continue using the Platform, you must
              subscribe to a paid plan. Trial data is retained for 90 days
              after trial expiration.
            </p>
          </Section>

          {/* 6. Data Collection, Use, and Sharing */}
          <Section number="6" title="Data Collection, Use, and Sharing">
            <h4 className="text-base font-semibold text-gray-900 mt-2 mb-2">
              6.1 Data You Provide
            </h4>
            <p>
              You provide corporate ESG data including but not limited to:
              energy consumption, emissions data, workforce composition, governance
              structures, supplier information, and other non-financial
              parameters. You retain ownership of all data you submit.
            </p>

            <h4 className="text-base font-semibold text-gray-900 mt-6 mb-2">
              6.2 Data Use for Analytics and Product Development
            </h4>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mt-2">
              <p className="text-gray-700">
                By using the Platform, you acknowledge and agree that the
                Company may use your data, in <strong>aggregated and
                anonymised form</strong>, for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 mt-3">
                <li>
                  <strong>Analytics:</strong> To generate industry benchmarks,
                  sector-level emission averages, ESG performance indices, and
                  aggregated statistical reports
                </li>
                <li>
                  <strong>Product Development:</strong> To improve the
                  Platform&apos;s algorithms, emission factor databases,
                  calculation methodologies, user experience, and feature set
                </li>
                <li>
                  <strong>Machine Learning:</strong> To train and improve
                  internal models for data validation, anomaly detection,
                  auto-classification of ESG parameters, and predictive
                  analytics
                </li>
                <li>
                  <strong>Research & Reporting:</strong> To publish anonymised
                  industry reports, white papers, and sustainability insights
                  that do not identify individual companies
                </li>
              </ul>
            </div>

            <h4 className="text-base font-semibold text-gray-900 mt-6 mb-2">
              6.3 Data Sharing with Third Parties
            </h4>
            <p>
              The Company may share aggregated and anonymised data with:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mt-2">
              <li>
                Research institutions and industry bodies for ESG benchmarking
                purposes
              </li>
              <li>
                Technology partners and sub-processors necessary for Platform
                operation (subject to Data Processing Agreements)
              </li>
              <li>
                Regulatory authorities when required by law
              </li>
            </ul>
            <p className="mt-3">
              We will <strong>never</strong> sell your individually identifiable
              company data to third parties. All shared data will be
              sufficiently aggregated and anonymised so that no individual
              company can be identified.
            </p>

            <h4 className="text-base font-semibold text-gray-900 mt-6 mb-2">
              6.4 Data Retention
            </h4>
            <p>
              Your data is retained for the duration of your active
              subscription plus 12 months after account termination. You may
              request full data export or deletion at any time in accordance
              with your rights under GDPR (see Section 9).
            </p>
          </Section>

          {/* 7. Intellectual Property */}
          <Section number="7" title="Intellectual Property">
            <p>
              The Platform, including its design, code, algorithms, emission
              factor databases, report templates, and all associated
              intellectual property, is owned by HelpH D.O.O. and protected by
              applicable copyright, trademark, and trade secret laws.
            </p>
            <p>
              You are granted a limited, non-exclusive, non-transferable licence
              to use the Platform for the duration of your subscription. You may
              not reverse-engineer, decompile, or create derivative works from
              the Platform.
            </p>
            <p>
              Any aggregated insights, benchmarks, or derived datasets produced
              by the Company from anonymised user data are the intellectual
              property of the Company.
            </p>
          </Section>

          {/* 8. Acceptable Use */}
          <Section number="8" title="Acceptable Use">
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mt-2">
              <li>
                Submit knowingly false, misleading, or fraudulent ESG data
              </li>
              <li>
                Use the Platform to misrepresent your company&apos;s
                environmental or social performance (greenwashing)
              </li>
              <li>
                Attempt to gain unauthorised access to other users&apos;
                accounts or data
              </li>
              <li>
                Use automated tools to scrape, extract, or harvest data from
                the Platform
              </li>
              <li>
                Resell access to the Platform without a valid Enterprise or
                white-label agreement
              </li>
              <li>
                Interfere with the Platform&apos;s infrastructure or security
                mechanisms
              </li>
            </ul>
          </Section>

          {/* 9. GDPR and Privacy */}
          <Section number="9" title="GDPR and Data Protection">
            <p>
              The Company processes personal and corporate data in accordance
              with the EU General Data Protection Regulation (GDPR, Regulation
              2016/679). Key provisions:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mt-3">
              <li>
                <strong>Data Residency:</strong> All data is stored within the
                European Union
              </li>
              <li>
                <strong>Legal Basis:</strong> Data processing is based on
                contractual necessity (Art. 6(1)(b)) and legitimate interest
                (Art. 6(1)(f)) for analytics and product development
              </li>
              <li>
                <strong>Your Rights:</strong> You have the right to access,
                rectify, erase, port, and restrict processing of your data.
                Contact{" "}
                <a
                  href="mailto:privacy@hosmos.io"
                  className="text-[var(--blue-primary)] hover:underline"
                >
                  privacy@hosmos.io
                </a>{" "}
                to exercise these rights
              </li>
              <li>
                <strong>Data Processing Agreement:</strong> A DPA is available
                upon request for all paying subscribers, as required by Art. 28
                GDPR
              </li>
              <li>
                <strong>Sub-processors:</strong> We maintain a current list of
                sub-processors available at{" "}
                <span className="text-[var(--blue-primary)]">
                  hosmos.io/sub-processors
                </span>
              </li>
            </ul>
          </Section>

          {/* 10. Security */}
          <Section number="10" title="Security">
            <p>
              We implement industry-standard security measures including:
              AES-256 encryption at rest, TLS 1.3 in transit, row-level
              security for data isolation, multi-factor authentication,
              immutable audit logging, and regular third-party penetration
              testing (OWASP Top 10).
            </p>
            <p>
              While we take all reasonable steps to protect your data, no
              system is completely secure. You acknowledge that you provide
              data at your own risk.
            </p>
          </Section>

          {/* 11. Limitation of Liability */}
          <Section number="11" title="Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable law:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mt-2">
              <li>
                The Platform is provided &quot;as is&quot; without warranties of
                any kind, express or implied
              </li>
              <li>
                The Company shall not be liable for any indirect, incidental,
                consequential, or punitive damages arising from your use of the
                Platform
              </li>
              <li>
                The Company&apos;s total liability shall not exceed the total
                fees paid by you in the 12 months preceding the claim
              </li>
              <li>
                The Company does not guarantee that ESG calculations will meet
                specific regulatory audit requirements. Users are responsible
                for verifying data accuracy with qualified professionals
              </li>
            </ul>
          </Section>

          {/* 12. Termination */}
          <Section number="12" title="Termination">
            <p>
              You may cancel your subscription at any time through your account
              settings or by contacting{" "}
              <a
                href="mailto:support@hosmos.io"
                className="text-[var(--blue-primary)] hover:underline"
              >
                support@hosmos.io
              </a>
              . Cancellation takes effect at the end of the current billing
              period.
            </p>
            <p>
              The Company may suspend or terminate your account if you violate
              these Terms, engage in fraudulent activity, or fail to pay
              subscription fees after the grace period.
            </p>
            <p>
              Upon termination, you may export your data within 30 days. After
              this period, data will be retained in accordance with our data
              retention policy (Section 6.4) and then permanently deleted.
            </p>
          </Section>

          {/* 13. Modifications to Terms */}
          <Section number="13" title="Modifications to Terms">
            <p>
              The Company reserves the right to modify these Terms at any time.
              Material changes will be communicated via email at least 30 days
              before they take effect. Your continued use of the Platform after
              the effective date constitutes acceptance of the updated Terms.
            </p>
            <p>
              We encourage you to review these Terms periodically. The
              &quot;Last updated&quot; date at the top of this page indicates
              when the most recent revision was made.
            </p>
          </Section>

          {/* 14. Governing Law */}
          <Section number="14" title="Governing Law and Dispute Resolution">
            <p>
              These Terms are governed by and construed in accordance with the
              laws of the Republic of Slovenia. Any disputes arising from these
              Terms shall be resolved by the competent courts in Ljubljana,
              Slovenia.
            </p>
            <p>
              Before initiating legal proceedings, both parties agree to attempt
              to resolve disputes through good-faith negotiation for a period
              of 30 days.
            </p>
          </Section>

          {/* 15. Contact */}
          <Section number="15" title="Contact Information">
            <p>
              For questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 rounded-xl p-5 mt-3 space-y-1 text-sm text-gray-600">
              <p>
                <strong>HelpH D.O.O.</strong>
              </p>
              <p>Email: support@hosmos.io</p>
              <p>Privacy inquiries: privacy@hosmos.io</p>
              <p>Website: hosmos.io</p>
            </div>
          </Section>

          {/* ========== PRIVACY POLICY ========== */}
          <div id="privacy" className="scroll-mt-24 pt-8 mt-12 border-t border-gray-200" />

          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
            Privacy Policy
          </h2>
          <p className="text-sm text-gray-400 mb-12">
            This Privacy Policy is an integral part of the Terms of Service above.
          </p>

          <Section number="P1" title="Data Controller">
            <p>
              The data controller is HelpH D.O.O., registered in the Republic
              of Slovenia. For all privacy-related inquiries, contact us at{" "}
              <a href="mailto:privacy@hosmos.io" className="text-[var(--blue-primary)] hover:underline">
                privacy@hosmos.io
              </a>.
            </p>
          </Section>

          <Section number="P2" title="Data We Collect">
            <p>We collect the following categories of data:</p>
            <h4 className="text-base font-semibold text-gray-900 mt-4 mb-2">Account Data</h4>
            <p>
              Name, email address, company name, job title, and password hash.
              Collected during registration and required to operate your account.
            </p>
            <h4 className="text-base font-semibold text-gray-900 mt-4 mb-2">Company ESG Data</h4>
            <p>
              Energy consumption, emissions data, fleet and transport information,
              workforce composition, governance structures, supplier information,
              and other non-financial parameters you submit through the Platform.
            </p>
            <h4 className="text-base font-semibold text-gray-900 mt-4 mb-2">Usage Data</h4>
            <p>
              Pages visited, features used, session duration, device type, browser
              type, IP address (anonymised after 30 days), and interaction patterns.
              Collected automatically to improve the Platform.
            </p>
            <h4 className="text-base font-semibold text-gray-900 mt-4 mb-2">Billing Data</h4>
            <p>
              Payment method details are processed directly by Stripe and are never
              stored on our servers. We retain only transaction IDs, plan type, and
              billing history.
            </p>
          </Section>

          <Section number="P3" title="How We Use Your Data">
            <div className="overflow-x-auto">
              <table className="w-full text-sm mt-2 border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 pr-4 font-semibold text-gray-900">Purpose</th>
                    <th className="text-left py-3 pr-4 font-semibold text-gray-900">Legal Basis (GDPR)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">Providing the Platform and calculating ESG indicators</td>
                    <td className="py-3 pr-4">Art. 6(1)(b) — contractual necessity</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">Generating compliance reports</td>
                    <td className="py-3 pr-4">Art. 6(1)(b) — contractual necessity</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">Analytics and product improvement (aggregated &amp; anonymised)</td>
                    <td className="py-3 pr-4">Art. 6(1)(f) — legitimate interest</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">Training ML models for data validation and benchmarking</td>
                    <td className="py-3 pr-4">Art. 6(1)(f) — legitimate interest</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">Publishing anonymised industry research and benchmarks</td>
                    <td className="py-3 pr-4">Art. 6(1)(f) — legitimate interest</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">Billing and payment processing</td>
                    <td className="py-3 pr-4">Art. 6(1)(b) — contractual necessity</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">Sending transactional emails (receipts, alerts)</td>
                    <td className="py-3 pr-4">Art. 6(1)(b) — contractual necessity</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Compliance with legal obligations</td>
                    <td className="py-3 pr-4">Art. 6(1)(c) — legal obligation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section number="P4" title="Data Sharing and Third Parties">
            <p>We share data only in the following cases:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mt-3">
              <li>
                <strong>Sub-processors:</strong> Vercel (hosting), Supabase
                (database and auth), Stripe (payments), Resend (email), Sentry
                (error monitoring). All sub-processors have signed Data Processing
                Agreements.
              </li>
              <li>
                <strong>Aggregated analytics:</strong> Anonymised, aggregated data
                may be shared with research institutions and industry bodies for
                ESG benchmarking. No individual company can be identified.
              </li>
              <li>
                <strong>Legal requirements:</strong> When required by law, court
                order, or regulatory authority.
              </li>
            </ul>
            <p className="mt-4">
              We do <strong>not</strong> sell your personal or company data to
              third parties. We do <strong>not</strong> use your data for
              advertising purposes.
            </p>
          </Section>

          <Section number="P5" title="Data Storage and Security">
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>All data is stored within the <strong>European Union</strong></li>
              <li>Encryption at rest: AES-256</li>
              <li>Encryption in transit: TLS 1.3</li>
              <li>Tenant isolation: PostgreSQL Row-Level Security</li>
              <li>Authentication: OAuth 2.0 with optional MFA (TOTP / WebAuthn)</li>
              <li>Backups: continuous with RPO 1h / RTO 4h</li>
              <li>Audit logging: immutable, timestamped logs of all data access</li>
            </ul>
          </Section>

          <Section number="P6" title="Your Rights">
            <p>Under GDPR, you have the following rights:</p>
            <div className="grid gap-3 mt-4">
              {[
                { right: "Access", desc: "Request a copy of all data we hold about you" },
                { right: "Rectification", desc: "Correct inaccurate or incomplete data" },
                { right: "Erasure", desc: "Request deletion of your data (\"right to be forgotten\")" },
                { right: "Portability", desc: "Receive your data in a structured, machine-readable format (JSON/CSV)" },
                { right: "Restriction", desc: "Restrict processing of your data in certain circumstances" },
                { right: "Objection", desc: "Object to processing based on legitimate interest" },
                { right: "Withdraw consent", desc: "Where processing is based on consent, withdraw it at any time" },
              ].map((item) => (
                <div key={item.right} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                  <span className="text-sm font-semibold text-gray-900 whitespace-nowrap min-w-[110px]">{item.right}</span>
                  <span className="text-sm text-gray-600">{item.desc}</span>
                </div>
              ))}
            </div>
            <p className="mt-4">
              To exercise any of these rights, email{" "}
              <a href="mailto:privacy@hosmos.io" className="text-[var(--blue-primary)] hover:underline">
                privacy@hosmos.io
              </a>
              . We will respond within 30 days.
            </p>
          </Section>

          <Section number="P7" title="Cookies">
            <p>
              Hosmos uses only <strong>essential cookies</strong> required for
              authentication and session management. We do not use advertising
              or tracking cookies. No cookie consent banner is required as we
              only use strictly necessary cookies (ePrivacy Directive Art. 5(3)
              exemption).
            </p>
          </Section>

          <Section number="P8" title="Data Retention">
            <div className="overflow-x-auto">
              <table className="w-full text-sm mt-2 border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 pr-4 font-semibold text-gray-900">Data Type</th>
                    <th className="text-left py-3 pr-4 font-semibold text-gray-900">Retention Period</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">Account data</td>
                    <td className="py-3 pr-4">Duration of subscription + 12 months</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">ESG company data</td>
                    <td className="py-3 pr-4">Duration of subscription + 12 months</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">Trial data (expired)</td>
                    <td className="py-3 pr-4">90 days after trial expiration</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">Usage / analytics data</td>
                    <td className="py-3 pr-4">24 months (anonymised after 30 days)</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">Billing records</td>
                    <td className="py-3 pr-4">As required by tax law (typically 10 years)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Audit logs</td>
                    <td className="py-3 pr-4">36 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section number="P9" title="Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. Material
              changes will be communicated via email at least 30 days before
              they take effect. The &quot;Last updated&quot; date at the top
              of this page indicates the most recent revision.
            </p>
          </Section>

          <Section number="P10" title="Supervisory Authority">
            <p>
              If you believe your data protection rights have been violated,
              you have the right to lodge a complaint with the Information
              Commissioner of the Republic of Slovenia (Informacijski
              poobla&scaron;&ccaron;enec) at{" "}
              <span className="text-[var(--blue-primary)]">www.ip-rs.si</span>,
              or with the supervisory authority in your country of residence.
            </p>
          </Section>
        </article>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
              <Globe size={14} className="text-white" />
            </div>
            <span className="font-serif text-lg">Hosmos</span>
            <span className="text-xs text-gray-400 ml-2">by HelpH D.O.O.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link
              href="/terms"
              className="text-gray-900 font-medium"
            >
              Terms & Privacy
            </Link>
            <Link href="#" className="hover:text-gray-600 transition-colors">
              Contact
            </Link>
            <span>&copy; 2025 Hosmos</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-serif text-gray-900 mb-4">
        <span className="text-[var(--blue-primary)] mr-2">{number}.</span>
        {title}
      </h2>
      <div className="space-y-3 text-[15px] text-gray-600 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
