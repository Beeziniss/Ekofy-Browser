import React from 'react'
import PendingRequestLayout from '../layout/pending-request-layout'
import RequestListSection from '../section/request-list-section'

const PendingRequestListView = () => {
  return (
    <PendingRequestLayout 
      title="Pending Requests"
      description="Manage and review artist requests"
    >
      <RequestListSection />
    </PendingRequestLayout>
  )
}

export default PendingRequestListView