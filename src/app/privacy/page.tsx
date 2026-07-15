import PageShell from "@/components/PageShell";
import { Card, Section, SectionHeading } from "@/components/ui";

export default function PrivacyPage() {
  return (
    <PageShell className="pb-20 pt-10">
      <Section>
        <SectionHeading
          eyebrow="Legal"
          title="Privacy Policy"
          subtitle="How we handle personal data on AgriCycle (India DPDP-aware draft)"
        />
        <Card hover={false} className="space-y-4 text-sm leading-relaxed text-muted">
          <p>
            We collect account data (name, email, optional phone/location),
            listings, offers, messages, and technical logs needed to run the
            marketplace.
          </p>
          <h3 className="font-semibold text-foreground">Use of data</h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>Authenticate users and secure sessions</li>
            <li>Match sellers and buyers; process offers</li>
            <li>Improve pricing models and product experience</li>
            <li>Comply with law and prevent fraud</li>
          </ul>
          <h3 className="font-semibold text-foreground">Processors</h3>
          <p>
            Hosting, database (e.g. Neon), and optional AI providers (e.g. Groq)
            may process data under their terms. Do not submit sensitive personal
            data beyond what is required for trade.
          </p>
          <h3 className="font-semibold text-foreground">Your rights</h3>
          <p>
            You may request access, correction, or deletion of your account data
            by contacting support. Retention follows operational and legal
            needs.
          </p>
          <h3 className="font-semibold text-foreground">Cookies</h3>
          <p>
            Session cookies are used for authentication. Analytics cookies (if
            added later) will be disclosed and, where required, consented to.
          </p>
        </Card>
      </Section>
    </PageShell>
  );
}
