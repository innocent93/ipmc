export default function Terms() {
  return (
    <div className="pt-24 container-custom max-w-3xl py-16 prose prose-lg">
      <h1 className="font-display text-4xl font-bold text-primary-900 mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().getFullYear()}</p>

      <h2>Use of This Site</h2>
      <p>
        This website is provided by Independent Project Monitoring Company Limited (IPMC) to share
        information about our services and to allow prospective clients to make inquiries. Content on
        this site is for informational purposes and doesn't constitute a binding offer of services.
      </p>

      <h2>Proposal Requests &amp; Contact Submissions</h2>
      <p>
        Submitting a proposal request or contact form through this site does not create a client
        engagement. Formal engagements are established through a separate signed agreement between
        IPMC and the client.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        Content, branding and materials on this site belong to IPMC unless otherwise noted, and may not
        be reproduced without permission.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms can be sent to{' '}
        <a href="mailto:enquiries@ipmc-ng.com">enquiries@ipmc-ng.com</a>.
      </p>
    </div>
  );
}
