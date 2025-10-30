import React from 'react'
import RequestDetailInfo from '../component/request-detail-info'
import ReviewDecisionActions from '../component/review-decision-actions'

interface RequestDetailSectionProps {
  requestId: string
}

const RequestDetailSection = ({ requestId }: RequestDetailSectionProps) => {
  return (
    <div className="space-y-6">
      <RequestDetailInfo requestId={requestId} />
      <ReviewDecisionActions requestId={requestId} />
    </div>
  )
}

export default RequestDetailSection