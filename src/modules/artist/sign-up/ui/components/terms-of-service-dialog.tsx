"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsOfServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsOfServiceDialog({ isOpen, onClose }: TermsOfServiceDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl border-gray-700 bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Terms and Conditions - Ekofy</DialogTitle>
          <p className="text-sm text-gray-400">Last Updated: December 2025</p>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6 text-gray-300">
            <p className="text-gray-200">
              Welcome to Ekofy. By accessing, registering, or using our services, you agree to be bound by these Terms
              and Conditions. Please read them carefully.
            </p>

            {/* Section 1 */}
            <section className="space-y-2">
              <h3 className="text-lg font-semibold text-white">1. Introduction & Acceptance</h3>
              <p>
                Ekofy is a music streaming platform that integrates artist collaboration and digital distribution
                services. This platform is developed as a Capstone Project at FPT University. By checking the &quot;I Agree&quot;
                box or using the service, you acknowledge that you have read, understood, and agreed to these terms.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-2">
              <h3 className="text-lg font-semibold text-white">2. Eligibility</h3>
              <p>To use Ekofy, you must meet the following age requirements:</p>
              <ul className="ml-6 list-disc space-y-1">
                <li>
                  <strong className="text-white">Listeners:</strong> You must be at least 13 years old.
                </li>
                <li>
                  <strong className="text-white">Artists:</strong> You must be at least 18 years old to legally enter
                  into a distribution agreement and receive payouts.
                </li>
                <li>
                  <strong className="text-white">Identity Verification:</strong> Artists are required to provide
                  accurate personal information and undergo identity verification (KYC) using a valid Citizen ID or
                  Passport.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-white">3. For Artists: Distribution Agreement</h3>
              <p>
                When you register as an Artist and upload music to Ekofy, you agree to the following distribution
                terms:
              </p>

              <div className="ml-4 space-y-3">
                <div>
                  <h4 className="font-semibold text-white">3.1. Grant of Rights</h4>
                  <p>
                    You grant Ekofy a non-exclusive, worldwide right to reproduce, distribute, publicly perform, and
                    display your content (including sound recordings, lyrics, and artwork) on the Ekofy platform. You
                    retain 100% ownership of your copyrights.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white">3.2. Artist Warranties & Copyright</h4>
                  <p>By uploading content, you warrant that:</p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>
                      You own or have the necessary licenses for all rights (Master Rights and Publishing Rights) to
                      the content you upload.
                    </li>
                    <li>
                      Your content does not infringe upon the intellectual property rights of any third party.
                      Unlicensed covers, remixes, or samples are strictly prohibited.
                    </li>
                    <li>
                      Ekofy reserves the right to remove any content that is flagged by our Fingerprint Check system or
                      reported for copyright infringement without prior notice.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white">3.3. Royalties & Payouts</h4>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>
                      <strong className="text-white">Revenue Collection:</strong> Ekofy collects royalties on your
                      behalf from streams and service packages.
                    </li>
                    <li>
                      <strong className="text-white">Payout Cycle:</strong> Royalties are processed and paid out at the end of each month.
                    </li>
                    <li>
                      <strong className="text-white">Minimum Payout Threshold:</strong> You may only withdraw funds
                      once your balance reaches the minimum threshold of $1.
                    </li>
                    <li>
                      <strong className="text-white">Royalty Splits:</strong> If you configure a royalty split for
                      collaborators (e.g., producers, band members), Ekofy will automatically distribute the revenue
                      according to the percentages you have set.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-white">4. For Listeners: Streaming & Subscriptions</h3>

              <div className="ml-4 space-y-3">
                <div>
                  <h4 className="font-semibold text-white">4.1. Personal Use License</h4>
                  <p>
                    Ekofy grants you a limited, non-exclusive, non-transferable license to stream music for personal,
                    non-commercial use only. You agree not to redistribute, rip, or transfer the content.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white">4.2. Subscriptions</h4>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>Listeners may purchase Premium subscriptions to access enhanced features.</li>
                    <li>
                      Payments are processed securely via third-party gateways (Stripe). Subscriptions automatically
                      renew unless canceled at least 24 hours before the end of the current billing cycle.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-white">5. Marketplace & Artist Services (Request Hub)</h3>
              <p>
                Ekofy facilitates a marketplace where Listeners can commission Artists for custom services (e.g., custom
                songs, mixing/mastering).
              </p>

              <div className="ml-4 space-y-3">
                <div>
                  <h4 className="font-semibold text-white">5.1. Escrow Mechanism</h4>
                  <p>
                    To ensure security for both parties, payments for Service Orders are held in Escrow. Funds are only
                    released to the Artist&apos;s wallet upon successful delivery and acceptance of the final product.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white">5.2. Refund Policy & Disputes</h4>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>
                      <strong className="text-white">Refunds:</strong> Listeners may request a refund if the Artist
                      fails to deliver on time or if the product does not meet the agreed requirements.
                    </li>
                    <li>
                      <strong className="text-white">Dispute Resolution:</strong> In the event of a disagreement, Ekofy
                      Moderators have the final authority to review evidence (chat logs, file exchanges) and decide on
                      a full, partial, or zero refund.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className="space-y-2">
              <h3 className="text-lg font-semibold text-white">6. Prohibited Conduct</h3>
              <p>You agree not to:</p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Use automated means (bots, scripts) to artificially inflate stream counts (fake streams).</li>
                <li>Upload content that is illegal, offensive, pornographic, or hate speech.</li>
                <li>Impersonate any person or entity.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-white">7. Disclaimer (Capstone Project)</h3>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong className="text-white">Prototype Status:</strong> Please note that Ekofy is a student
                  Capstone Project. Features such as ISRC/ISWC generation are simulated for educational and
                  demonstration purposes and are not registered with international agencies (IFPI/CISAC) unless
                  explicitly stated otherwise.
                </li>
                <li>
                  <strong className="text-white">Limitation of Liability:</strong> Ekofy provides the service &quot;as is&quot;
                  and assumes no liability for any data loss, service interruptions, or unauthorized access to your
                  account.
                </li>
              </ul>
            </section>

            {/* Section 8 */}
            <section className="space-y-2">
              <h3 className="text-lg font-semibold text-white">8. Changes to Terms</h3>
              <p>
                Ekofy reserves the right to modify these Terms at any time. Continued use of the platform constitutes
                your acceptance of the revised terms.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
