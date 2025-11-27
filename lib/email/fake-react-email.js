/**
 * Fake @react-email/render stub
 * This prevents Next.js from trying to bundle the real @react-email/render
 * (which would cause Html component import errors in App Router)
 *
 * We don't use React Email components - we generate HTML with template strings
 * in lib/email/resend.ts instead.
 */

module.exports = {
  render: function () {
    throw new Error(
      '@react-email/render is not configured for this project. ' +
        'Use custom HTML generation in lib/email/resend.ts instead.'
    );
  },
};
