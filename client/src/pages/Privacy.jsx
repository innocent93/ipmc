export default function Privacy() {
  return (
    <div className="pt-24 container-custom max-w-3xl py-16 prose prose-lg">
      <h1 className="font-display text-4xl font-bold text-primary-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().getFullYear()}</p>

      <h2>What We Collect</h2>
      <p>
        When you submit a contact form, proposal request, or newsletter signup on this site, we collect
        the information you provide directly — name, email address, phone number, company, and message
        content — solely to respond to your inquiry.
      </p>

      <h2>How We Use It</h2>
      <p>
        Information submitted through this site is used to respond to inquiries, process proposal
        requests, and — where you've opted in — send occasional newsletter updates. We do not sell or
        rent your information to third parties.
      </p>

      <h2>Data Retention</h2>
      <p>
        Contact and proposal submissions are retained for as long as necessary to respond to your
        inquiry and maintain business records. Newsletter subscribers can unsubscribe at any time.
      </p>

      <h2>Contact Us</h2>
      <p>
        For questions about this policy or to request removal of your data, contact us at{' '}
        <a href="mailto:enquiries@ipmc-ng.com">enquiries@ipmc-ng.com</a>.
      </p>
    </div>
  );
}
