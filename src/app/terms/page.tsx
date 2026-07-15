import PageShell from "@/components/PageShell";
import { Card, Section, SectionHeading } from "@/components/ui";

export default function TermsPage() {
  return (
    <PageShell className="pb-20 pt-10">
      <Section>
        <SectionHeading
          eyebrow="Legal"
          title="Terms of Service"
          subtitle="Last updated: July 2026 · AgriCycle beta marketplace"
        />
        <Card hover={false} className="prose prose-sm max-w-none space-y-4 text-muted">
          <p>
            AgriCycle provides a digital platform for listing and discovering
            agricultural waste feedstock. By creating an account or using the
            service you agree to these terms.
          </p>
          <h3 className="font-semibold text-foreground">1. Nature of the service</h3>
          <p>
            The platform facilitates introductions between sellers and buyers.
            Price predictions, quality grades, and distance estimates are{" "}
            <strong className="text-foreground">advisory only</strong> and do
            not constitute a binding quote, guarantee of sale, or professional
            appraisal.
          </p>
          <h3 className="font-semibold text-foreground">2. Accounts & roles</h3>
          <p>
            You are responsible for account security and for accurate
            information. Misrepresentation of waste quality, quantity, or
            identity may result in suspension.
          </p>
          <h3 className="font-semibold text-foreground">3. Payments & escrow</h3>
          <p>
            Demo escrow and payment actions are simulated unless a production
            payment provider is enabled. When live payments are enabled,
            applicable platform fees, refund, and dispute rules will be
            disclosed at checkout.
          </p>
          <h3 className="font-semibold text-foreground">4. Logistics</h3>
          <p>
            Transport bookings may be records for coordination only until
            carrier partners are contracted. Liability for carriage remains
            with the contracted transporter.
          </p>
          <h3 className="font-semibold text-foreground">5. Limitation of liability</h3>
          <p>
            To the fullest extent permitted by law, AgriCycle is not liable for
            indirect losses, crop outcomes, regulatory penalties from residue
            burning alternatives chosen by users, or third-party failures.
          </p>
          <h3 className="font-semibold text-foreground">6. Contact</h3>
          <p>
            For legal notices contact the operator listed on the site About /
            contact section once your company entity is published.
          </p>
        </Card>
      </Section>
    </PageShell>
  );
}
