'use client'

import React from 'react'
import { Search, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'

interface RequestData {
  id: string
  artistName: string
  requestType: string
  submittedDate: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'PENDING'
}

const mockData: RequestData[] = [
  {
    id: 'REQ-001',
    artistName: 'Sarah Chen',
    requestType: 'Portfolio Update',
    submittedDate: '2025-10-28',
    priority: 'HIGH',
    status: 'PENDING'
  },
  {
    id: 'REQ-002',
    artistName: 'Marcus Johnson',
    requestType: 'Profile Verification',
    submittedDate: '2025-10-27',
    priority: 'MEDIUM',
    status: 'PENDING'
  },
  {
    id: 'REQ-003',
    artistName: 'Elena Rodriguez',
    requestType: 'Content Appeal',
    submittedDate: '2025-10-26',
    priority: 'LOW',
    status: 'PENDING'
  },
  {
    id: 'REQ-004',
    artistName: 'James Park',
    requestType: 'Account Recovery',
    submittedDate: '2025-10-25',
    priority: 'HIGH',
    status: 'PENDING'
  },
  {
    id: 'REQ-005',
    artistName: 'Nina Patel',
    requestType: 'Portfolio Update',
    submittedDate: '2025-10-24',
    priority: 'MEDIUM',
    status: 'PENDING'
  }
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'HIGH':
      return 'bg-red-100 text-red-800 hover:bg-red-100'
    case 'MEDIUM':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    case 'LOW':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
  }
}

const RequestListTable = () => {
  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by artist name, request ID..."
            className="pl-10"
          />
        </div>
        {/* <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button> */}
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Artist Name</TableHead>
              <TableHead>Request Type</TableHead>
              <TableHead>Submitted Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.id}</TableCell>
                <TableCell>{request.artistName}</TableCell>
                <TableCell>{request.requestType}</TableCell>
                <TableCell>{request.submittedDate}</TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary"
                    className={`${getPriorityColor(request.priority)} w-20`}
                  >
                    {request.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-blue-500 text-white hover:bg-blue-600">
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link href={`/artist/studio/pending-request/${request.id}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 5 pending requests
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RequestListTable