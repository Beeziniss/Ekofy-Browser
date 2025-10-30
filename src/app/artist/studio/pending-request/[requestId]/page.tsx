import React from 'react'
import PendingRequestDetailView  from '@/modules/artist/pending-request/ui/view/pending-request-detail-view'

interface PendingRequestPageDetailProps {
  params: {
    requestId: string
  }
}

const PendingRequestPageDetail = ({ params }: PendingRequestPageDetailProps) => {
  return <PendingRequestDetailView requestId={params.requestId} />
}

export default PendingRequestPageDetail
