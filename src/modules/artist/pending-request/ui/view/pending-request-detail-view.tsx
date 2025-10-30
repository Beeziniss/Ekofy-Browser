import React from 'react'
import PendingRequestDetailLayout from '../layout/pending-request-detail-layout'
import RequestDetailSection from '../section/request-detail-section'

interface PendingRequestDetailViewProps {
  requestId: string
}

const PendingRequestDetailView = ({ requestId }: PendingRequestDetailViewProps) => {
  return (
    <PendingRequestDetailLayout 
    //   title="Request Details"
    //   description={`Reviewing request ${requestId}`}
    >
      <RequestDetailSection requestId={requestId} />
    </PendingRequestDetailLayout>
  )
}

export default PendingRequestDetailView