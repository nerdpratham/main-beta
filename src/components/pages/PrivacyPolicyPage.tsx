import { colors, fonts } from '../../styles/tokens'

const INTRO =
  'SixD Engineering Solutions Pvt. Ltd. (“Company”, “we”, “our”, or “us”) is committed to protecting your personal information and respecting your privacy. This Privacy Policy explains how we collect, use, store, and safeguard information when you interact with our website. By using our website, you consent to the practices described in this Privacy Policy.'

const POLICY_SECTIONS = [
  {
    title: '1. Information We Collect',
    body: 'We may collect the following personal information when you submit a form or contact us through our website:\n• Name\n• Email Address\n• Phone Number\n• Company Name\nThis information is collected only when voluntarily provided through the Contact Us form',
  },
  {
    title: '2. How We Use Your Information',
    body: 'We use the information submitted to us for the following purposes:\n• To respond to enquiries and provide requested information\n• To contact you for sales discussions\n• To support internal record-keeping and customer service\n• To improve communication and follow up on service-related queries',
  },
  {
    title: '3. Sharing of Information',
    body: 'We do not sell or share your personal information with external third parties. However, we may share your data internally within SixD Engineering Solutions Pvt. Ltd. for purposes such as:\n• Sales follow-ups\n• Customer service communication\n• Project-related coordination\nNo external vendors or third-party services receive your personal data.',
  },
  {
    title: '4. Data Retention',
    body: 'We retain your information only for as long as necessary to fulfill the purposes for which it was collected or to comply with legal, regulatory, or operational requirements.',
  },
  {
    title: '5. User Rights',
    body: 'You have full control over your personal data. At any time, you may:\n• Request deletion of your data\n• Request a copy of the information we hold\n• Opt out of any future communication',
  },
  {
    title: '6. Security of Your Information',
    body: 'We take reasonable administrative and technical measures to protect your personal data from unauthorized access, misuse, loss, or alteration. While no system is completely secure, we work to ensure your information remains protected.',
  },
  {
    title: '7. External Links',
    body: 'Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those external sites. We encourage users to review the privacy policies of those websites.',
  },
  {
    title: '8. Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time to reflect changes in technology, legal requirements, or service offerings. Updates will be posted on this page with the revised “Last Updated” date.',
  },
  {
    title: '9. Contact Information',
    body: 'If you have any questions, concerns, or requests related to this Privacy Policy or your personal information, please contact us at:\ninfo@sixdengineering.com',
  },
] as const

export default function PrivacyPolicyPage() {
  return (
    <section
      data-theme="light"
      className="privacy-policy-page"
      aria-labelledby="privacy-policy-title"
      style={{
        minHeight: '100svh',
        background: colors.white,
        color: colors.ink,
      }}
    >
      <style>{`
        .privacy-policy-page {
          padding: 96px 20px 96px;
        }

        .privacy-policy-content {
          width: min(100%, 690px);
        }

        .privacy-policy-title {
          font-family: ${fonts.helvetica};
          font-size: 60px;
          font-weight: 500;
          line-height: 0.95;
          letter-spacing: -0.03em;
          color: ${colors.ink};
          margin: 0 0 20px;
        }

        .privacy-policy-copy {
          width: min(100%, 541px);
          font-family: ${fonts.helvetica};
          font-size: 16px;
          font-weight: 400;
          line-height: 1.5;
          letter-spacing: -0.03em;
          color: ${colors.ink};
          white-space: pre-line;
          text-transform: capitalize;
          margin: 0;
        }

        .privacy-policy-section-list {
          display: flex;
          flex-direction: column;
          gap: 40px;
          margin-top: 40px;
        }

        .privacy-policy-section {
          width: min(100%, 690px);
        }

        .privacy-policy-heading {
          font-family: ${fonts.helvetica};
          font-size: 36px;
          font-weight: 400;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: ${colors.ink};
          margin: 0 0 16px;
        }

        @media (max-width: 809px) {
          .privacy-policy-page {
            padding: 92px 20px 72px;
          }

          .privacy-policy-title {
            font-size: 48px;
            line-height: 1;
          }

          .privacy-policy-heading {
            font-size: 30px;
            line-height: 1.08;
          }

          .privacy-policy-copy {
            font-size: 15px;
            line-height: 1.48;
          }

          .privacy-policy-section-list {
            gap: 36px;
          }
        }
      `}</style>

      <div className="privacy-policy-content">
        <h1 id="privacy-policy-title" className="privacy-policy-title">
          Privacy Policy
        </h1>
        <p className="privacy-policy-copy">{INTRO}</p>

        <div className="privacy-policy-section-list">
          {POLICY_SECTIONS.map(section => (
            <section key={section.title} className="privacy-policy-section">
              <h2 className="privacy-policy-heading">{section.title}</h2>
              <p className="privacy-policy-copy">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
