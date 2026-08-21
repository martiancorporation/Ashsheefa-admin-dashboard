import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Content sourced from the Ashsheefa frontend
// (terms-conditions & privacy-policy pages). Kept as modals here so the admin
// login does not need standalone pages.

function TermsContent() {
  return (
    <div className="max-w-none space-y-4">
      <p className="leading-normal">
        Welcome to Ashsheefa Hospital. These Terms &amp; Conditions ("Terms")
        govern your access to and use of the website (
        <a
          href="https://ashsheefahospital.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          https://ashsheefahospital.com
        </a>
        ) and the Ashsheefa Hospital mobile application (together, the
        "Services"), and any services, features or content made available
        through them. By accessing or using the Services you accept and agree to
        be bound by these Terms and our Privacy Policy. If you do not agree with
        these Terms, please do not use the Services.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        1. Who can use the Services
      </h3>
      <p>
        You must be 18 years or older to register for or use certain features of
        the Services. If you are under 18, a parent or legal guardian must
        provide consent and use the Services on your behalf.
      </p>
      <p>
        By using the Services you represent and warrant that you have the legal
        capacity to enter into this Agreement.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        2. Accounts, registration &amp; security
      </h3>
      <p>
        To use some parts of the Services you may be required to register and
        create an account. You agree to provide accurate, current and complete
        information when registering.
      </p>
      <p>
        You are responsible for maintaining the confidentiality of your account
        credentials and for all activity that occurs under your account. Notify
        us immediately if you suspect unauthorized use of your account.
      </p>
      <p>
        We reserve the right to suspend or terminate accounts that are inactive,
        fraudulent, in breach of these Terms, or where we have reasonable grounds
        to suspect misuse.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        3. Appointment booking, teleconsultation, diagnostics &amp; medicines
      </h3>
      <p>
        The Services allow you to search for doctors, book appointments, order
        diagnostic tests, and connect with medical service providers. While we
        try to ensure availability, bookings are subject to confirmation by the
        service provider. We are not liable for cancellations, rescheduling or
        provider unavailability.
      </p>
      <p>
        Teleconsultations and online interactions are provided as a convenience.
        They do not create a doctor–patient relationship with Ashsheefa Hospital
        itself; the relationship is between you and the treating clinician. In
        case of medical emergencies, contact emergency services or visit the
        nearest hospital—do not rely on the App/Website for emergency care.
      </p>
      <p>
        Any medical advice or information provided through the Services is for
        informational purposes and should not replace professional in-person
        medical consultation.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        4. Payments, cancellations &amp; refunds
      </h3>
      <p>
        Payments made through the Services are processed via third-party payment
        gateways. Transactions are subject to the payment gateway’s terms and
        privacy practices. Ashsheefa Hospital is not liable for failures of the
        payment gateway or banking network.
      </p>
      <p className="font-semibold">
        Cancellation &amp; Refund Policy (Appointments &amp; Consultations):
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          If you cancel before the scheduled appointment time: consultation fees
          will be refunded (100%) to the original payment source. Convenience or
          processing fees charged by payment gateways may not be refundable.
        </li>
        <li>
          If you cancel after the scheduled appointment time or do not show up:
          consultation fees and convenience fees will not be refunded.
        </li>
        <li>
          If the hospital or the booked medical provider cancels the appointment:
          100% refund of consultation fee and convenience fee will be issued.
        </li>
      </ul>
      <p>
        Refunds will be processed to the same payment method used for the booking
        and may take up to 7 working days, subject to the processing timelines of
        the payment provider and bank.
      </p>
      <p>
        For diagnostic test orders, medicine orders and other paid services,
        cancellation and refund terms may vary depending on the provider and the
        status of test collection, lab processing or dispatch. Refund timelines
        are subject to third-party payment processors.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        5. User content, reviews &amp; conduct
      </h3>
      <p>
        You are responsible for any content you upload, post, submit or transmit
        via the Services (including reviews, feedback, medical records or other
        user-generated content). You represent that you have rights to upload
        such content and that it does not violate any law or third-party rights.
      </p>
      <p>
        Prohibited conduct: do not post content that is unlawful, defamatory,
        obscene, pornographic, abusive, invasive of privacy, infringing of
        intellectual property, harmful to minors, or otherwise objectionable. Do
        not use automated means (bots, scrapers) to access the Services.
      </p>
      <p>
        We may moderate, remove, or disable access to content that violates these
        Terms or applicable law. We reserve the right to suspend or terminate
        access for users who breach these rules.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        6. Intellectual property
      </h3>
      <p>
        All content available through the Services (text, graphics, logos, icons,
        images, software, audio and video) is the property of Ashsheefa Hospital
        or its licensors and is protected by intellectual property laws. You may
        use content only for your personal, non-commercial use and must not copy,
        reproduce, modify, publish or distribute it without our prior written
        consent.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        7. Privacy &amp; data protection
      </h3>
      <p>
        Our collection and use of personal information are governed by our
        Privacy Policy. By using the Services you consent to the collection and
        processing of information as described in the Privacy Policy.
      </p>
      <p>
        You are responsible for ensuring that any third-party whose personal data
        you provide to us has consented to such sharing.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        8. Third-party services &amp; links
      </h3>
      <p>
        The Services may contain links to third-party websites, labs, pharmacies,
        payment gateways, or integrations. We do not control and are not
        responsible for the content, services, privacy or security practices of
        those third parties. Linking to a third-party site does not imply
        endorsement.
      </p>
      <p>
        When you transact with a third party through the Services, your
        relationship is directly with that third party and you agree that
        Ashsheefa Hospital is not responsible for the acts or omissions of such
        third party.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        9. Disclaimers; No warranties
      </h3>
      <p>
        The Services are provided on an “as is” and “as available” basis.
        Ashsheefa Hospital makes no warranties or representations, express or
        implied, regarding the completeness, accuracy, reliability, suitability or
        availability of the Services.
      </p>
      <p>
        We expressly disclaim all implied warranties, including merchantability,
        fitness for a particular purpose and non-infringement to the fullest
        extent permitted by law.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        10. Limitation of liability
      </h3>
      <p>
        To the maximum extent permitted by applicable law, Ashsheefa Hospital,
        its officers, employees, agents and partners shall not be liable for any
        direct, indirect, incidental, special, consequential or exemplary
        damages, including but not limited to loss of profits, data, use,
        goodwill, or other intangible losses arising out of or in connection with
        your access to or use of the Services, even if we have been advised of the
        possibility of such damages.
      </p>
      <p>
        Nothing in these Terms excludes or limits liability for (a) death or
        personal injury resulting from our negligence, (b) fraud, or (c) any
        other liability which cannot be limited or excluded under applicable law.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        11. Indemnity
      </h3>
      <p>
        You agree to indemnify and hold harmless Ashsheefa Hospital, its
        affiliates, officers, directors, employees and agents from and against
        any claims, liabilities, damages, losses and expenses (including
        reasonable legal fees) arising from your breach of these Terms, violation
        of law, or your use of the Services.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        12. Termination
      </h3>
      <p>
        We may suspend or terminate your access to all or part of the Services at
        any time, without notice, for any reason, including breach of these Terms,
        suspected fraudulent or illegal activity, or inactivity.
      </p>
      <p>
        On termination, your right to access the Services will immediately cease.
        Termination does not limit our rights to any other remedies available
        under law or equity.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        13. Governing law &amp; dispute resolution
      </h3>
      <p>
        These Terms are governed by the laws of India. Any dispute arising out of
        or relating to these Terms or the Services shall be subject to the
        exclusive jurisdiction of the courts located in Kolkata (Calcutta), West
        Bengal, India.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        14. Changes to Terms
      </h3>
      <p>
        We may modify these Terms from time to time. Updated Terms will be posted
        on the Services with a revised Effective Date. Continued use of the
        Services after changes indicates your acceptance of the updated Terms. We
        recommend that you review the Terms periodically.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        15. Severability &amp; waiver
      </h3>
      <p>
        If any provision of these Terms is held invalid or unenforceable, the
        remaining provisions will remain in full force and effect. Our failure to
        enforce any right or provision in these Terms will not constitute a waiver
        of such right or provision.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        16. Contact &amp; Grievance Officer
      </h3>
      <p>
        If you have questions, complaints or want to report a breach of these
        Terms, please contact:
      </p>
      <p>
        <strong>Grievance / Contact</strong>
        <br />
        Ashsheefa Hospital
        <br />
        Address: Jagannathpur, Sahararhat, Falta, South 24 Parganas, 743504
        <br />
        Email:{" "}
        <a
          href="mailto:ashsheefa.hospital@gmail.com"
          className="text-blue-600 hover:underline"
        >
          ashsheefa.hospital@gmail.com
        </a>
        <br />
        Phone:{" "}
        <a href="tel:+919339732293" className="text-blue-600 hover:underline">
          9339732293
        </a>
        ,{" "}
        <a href="tel:+919836001515" className="text-blue-600 hover:underline">
          9836001515
        </a>
      </p>
      <p>
        We will attempt to acknowledge and resolve grievances promptly. If you
        remain unsatisfied, you may approach the appropriate regulatory authority.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        Acknowledgement
      </h3>
      <p>
        By using the Services you acknowledge that you have read, understood and
        agree to be bound by these Terms &amp; Conditions.
      </p>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div className="max-w-none space-y-4">
      <p className="leading-normal">
        Ashsheefa Hospital &amp; App ("Ashsheefa", "we", "our", or "us") is
        committed to protecting the privacy and confidentiality of the personal
        and medical information you share with us through our website, mobile
        application ("Ashsheefa Hospital"), and in-person services. This Privacy
        Policy explains what information we collect, why we collect it, how we use
        and protect it, and the choices and rights you have.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        Short patient-friendly summary
      </h3>
      <p className="leading-relaxed">
        We collect basic contact and health-related information (name, mobile
        number, gender, age, lab reports, prescriptions and medical history) to
        provide medical care, appointment management and related services. We keep
        your data secure, do not sell your personal health information, and you
        can contact us to access, correct or request deletion of your data
        (subject to legal retention requirements).
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        1. Scope
      </h3>
      <p>This Privacy Policy applies to personal data collected when you:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Use our website;</li>
        <li>Use our mobile app Ashsheefa Hospital; or</li>
        <li>
          Receive clinical or related services from Ashsheefa Hospital (in-person
          or remotely).
        </li>
      </ul>
      <p>
        This policy covers patients, caregivers, app users, website visitors, and
        other persons whose data we process.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        2. Information We Collect
      </h3>
      <p className="font-semibold">Personal identifiers</p>
      <p>
        Name, mobile number, date of birth or age, gender, address (when
        provided), email (if provided), emergency contact.
      </p>
      <p className="font-semibold">Health &amp; medical information (sensitive)</p>
      <p>
        Medical history, diagnoses, prescriptions, lab reports, imaging reports
        and other clinical records you or clinical staff upload or provide.
      </p>
      <p className="font-semibold">Account &amp; transaction data</p>
      <p>
        Usernames, passwords and authentication credentials (if you create an
        account), appointment bookings, billing or insurance details if provided
        for payment/claims.
      </p>
      <p className="font-semibold">Technical &amp; usage data</p>
      <p>
        IP address, device or browser information, app version, log files,
        timestamps, pages/screens viewed, cookies and analytics data for improving
        the Services.
      </p>
      <p className="font-semibold">Uploaded files &amp; documents</p>
      <p>
        Files you upload via the App or website (for example: lab reports,
        prescriptions, referral letters). You should only upload information you
        are comfortable sharing; please do not upload third-party sensitive data
        unless you have permission.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        3. How We Collect Data
      </h3>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Directly from you (forms, app uploads, appointment bookings, email/phone
          communication).
        </li>
        <li>From healthcare staff during treatment.</li>
        <li>
          From third parties where necessary for care (diagnostic labs,
          pharmacies, insurance companies).
        </li>
        <li>
          Automatically via cookies, analytics and server logs when you use the
          website or app.
        </li>
      </ul>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        4. Why We Use Your Data (Purposes)
      </h3>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Provide and coordinate medical care, share test results and
          prescriptions, and maintain medical records.
        </li>
        <li>
          Schedule and manage appointments and send reminders/notifications.
        </li>
        <li>
          Process payments and insurance claims when you provide billing data.
        </li>
        <li>
          Improve our services, carry out research and analytics on de-identified
          data, and personalise user experience.
        </li>
        <li>
          Detect, prevent or investigate fraud, abuse or security incidents.
        </li>
        <li>Comply with legal, regulatory or public health obligations.</li>
        <li>
          Communicate with you about services, health alerts and (with your
          consent) promotional offers.
        </li>
      </ul>
      <p>
        We will not use your health data for unrelated purposes without your
        explicit consent.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        5. Legal Basis &amp; Consent
      </h3>
      <p>
        By using our Services or providing your information, you consent to
        Ashsheefa collecting and processing your personal and health information
        for the purposes described in this policy. Where required by law, we will
        seek explicit consent to process sensitive health data. You may withdraw
        consent at any time, but withdrawal may limit our ability to provide
        certain services.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        6. Sharing &amp; Disclosure
      </h3>
      <p>We may share your information with:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Doctors, nurses and authorised clinical staff involved in your care.
        </li>
        <li>
          Laboratories, diagnostic centres, pharmacies and other healthcare
          providers as needed for diagnosis, treatment or billing.
        </li>
        <li>
          Payment processors and insurance companies to process transactions and
          claims.
        </li>
        <li>
          IT, cloud hosting and analytics service providers under contract and
          confidentiality obligations.
        </li>
        <li>
          Regulators, public health authorities or law enforcement when required
          by law.
        </li>
        <li>
          Professional advisors (auditors, legal advisors) where necessary and
          bound by confidentiality.
        </li>
        <li>
          Potential purchasers or restructuring parties in connection with a
          business sale or reorganisation (subject to safeguards).
        </li>
      </ul>
      <p>We do not sell your personal or health information.</p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        7. Cross-Border Transfers
      </h3>
      <p>
        Your information may be stored or processed on servers located outside
        India (for example, by our cloud providers). When we transfer data
        internationally, we will use contractual safeguards and other measures
        required by applicable law to protect your data.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        8. Data Retention
      </h3>
      <p>
        We retain personal and medical records for the period required by
        applicable laws and medical practice standards. As a general rule, records
        will be kept for a minimum of three (3) years from the date of last
        service unless a longer retention period is required by law or
        professional guidelines. After the applicable retention period, data will
        be securely deleted or anonymised.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        9. Security
      </h3>
      <p>
        We use reasonable administrative, technical and physical safeguards to
        protect your data, including:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Encryption in transit (HTTPS/TLS) and where appropriate at rest;
        </li>
        <li>
          Role-based access controls and authentication (including MFA where
          used);
        </li>
        <li>Secure servers, firewalls and routine security assessments;</li>
        <li>
          Staff training and confidentiality obligations for authorised personnel.
        </li>
      </ul>
      <p>
        No system is completely risk-free. In the event of a data breach, we will
        follow applicable legal requirements for notification and mitigation.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        10. Cookies &amp; Tracking
      </h3>
      <p>
        We use cookies and similar technologies to enable core functionality,
        remember preferences and analyse usage. You may control or block cookies
        via your browser or device settings; disabling cookies may reduce website
        or app functionality.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        11. Mobile App Permissions &amp; Uploads
      </h3>
      <p>
        To provide features such as report upload and reminders, the App may
        request permissions such as:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Camera (to capture or upload images of reports/prescriptions),</li>
        <li>Storage/Files (to upload reports or documents),</li>
        <li>Notifications (to send appointment reminders).</li>
      </ul>
      <p>
        You can manage these permissions in your device settings. The App only
        accesses these features to provide the Services and does not read
        unrelated personal data.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        12. Your Rights &amp; Choices
      </h3>
      <p>
        Subject to applicable law and medical record retention rules, you may:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Request access to and obtain a copy of your personal data.</li>
        <li>Request correction of inaccurate or incomplete information.</li>
        <li>
          Request deletion of your personal data (to the extent permitted by law).
        </li>
        <li>Withdraw consent for non-essential processing.</li>
        <li>Object to or restrict certain processing.</li>
        <li>
          Request transfer/portability of your data where technically feasible.
        </li>
      </ul>
      <p>
        To exercise these rights, contact our Grievance Officer (details below).
        We may require identity verification and may refuse or limit requests
        where legally permitted.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        13. Children &amp; Minors
      </h3>
      <p>
        We do not knowingly collect personal data from children without parental
        or guardian consent. If the patient is a minor, data should be submitted
        by a parent or legal guardian. If you believe we have collected a child’s
        information without consent, contact us to request deletion.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        14. Emergency &amp; Public Health Disclosures
      </h3>
      <p>
        When required to protect life, public health, or comply with legal
        obligations (for example, reportable infectious diseases), we may process
        or disclose health information without prior consent to the extent
        permitted by law.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        15. Third-Party Links &amp; Integrations
      </h3>
      <p>
        Our website or app may link to third-party websites or services (lab
        portals, payment gateways, external resources). We are not responsible for
        the privacy practices or content of those third parties. Review their
        privacy policies before sharing personal information.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        16. Complaints &amp; Grievance Redressal
      </h3>
      <p>
        If you have questions, complaints, or requests about this Privacy Policy
        or our data practices, contact:
      </p>
      <p>
        <strong>Grievance / Privacy Contact</strong>
        <br />
        Ashsheefa Hospital
        <br />
        Address: Jagannathpur, Sahararhat, Falta, South 24 Parganas, 743504
        <br />
        Email:{" "}
        <a
          href="mailto:ashsheefa.hospital@gmail.com"
          className="text-blue-600 hover:underline"
        >
          ashsheefa.hospital@gmail.com
        </a>
        <br />
        Phone:{" "}
        <a href="tel:+919339732293" className="text-blue-600 hover:underline">
          9339732293
        </a>
        ,{" "}
        <a href="tel:+919836001515" className="text-blue-600 hover:underline">
          9836001515
        </a>
      </p>
      <p>
        We will acknowledge and attempt to resolve grievances promptly. If you
        remain unsatisfied, you may approach applicable regulatory authorities.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        17. Changes to This Policy
      </h3>
      <p>
        We may update this Privacy Policy to reflect legal, technical or business
        changes. The Effective Date at the top indicates the most recent revision.
        Continued use of our Services after changes indicates your acceptance of
        the revised policy.
      </p>

      <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-900">
        Acknowledgement
      </h3>
      <p>
        By using our website, app, or by providing personal or medical information
        to Ashsheefa Hospital, you acknowledge that you have read, understood and
        agreed to the terms of this Privacy Policy.
      </p>
    </div>
  );
}

export default function LegalPolicyModal({ open, onOpenChange, type }) {
  const isTerms = type === "terms";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* shadcn Dialog closes on outside click and Esc by default */}
      <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-2xl font-bold text-gray-900">
            {isTerms ? "Terms & Conditions" : "Privacy Policy"}
          </DialogTitle>
          <p className="text-xs md:text-sm text-gray-600">
            <strong>Effective Date:</strong> 16 September 2025
          </p>
        </DialogHeader>

        <div className="overflow-y-auto pr-2 text-sm text-gray-800">
          {isTerms ? <TermsContent /> : <PrivacyContent />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
