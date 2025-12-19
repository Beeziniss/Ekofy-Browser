"use client";

import { FingerprintListSection } from "../sections/fingerprint-list-section";
import { FingerprintLayout } from "../layouts/fingerprint-layout";

export function FingerprintView() {
  return (
    <FingerprintLayout
      title="Fingerprint Confidence Policy"
      description="Configure and manage fingerprint confidence thresholds for content matching and duplicate detection"
    >
      <FingerprintListSection />
    </FingerprintLayout>
  );
}

