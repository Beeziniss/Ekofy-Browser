'use client'

import React from 'react'
import { ArrowLeft, Clock, FileText, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface RequestDetailInfoProps {
    requestId: string
}

const RequestDetailInfo = ({ requestId }: RequestDetailInfoProps) => {
    // Mock data - in real app, fetch based on requestId
    const requestData = {
        id: requestId,
        type: 'Portfolio Update',
        priority: 'HIGH',
        description: 'Request to update portfolio with new artwork series "Urban Landscapes". The collection includes 12 high-resolution digital paintings created over the past 6 months. All pieces follow content guidelines and are original work.',
        additionalNotes: 'Previous portfolio was last updated 8 months ago. Artist has verified ownership of all submitted pieces through blockchain verification.',
        submittedDate: '2025-10-28',
        status: 'Pending Review'
    }

    const artistData = {
        name: 'Sarah Chen',
        email: 'sarah.chen@example.com',
        memberSince: 'January 2024',
        totalArtworks: '47 pieces'
    }

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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/artist/studio/pending-request">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Request List
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Title */}
            <div>
                <h1 className="text-2xl font-bold text-white">Request Details</h1>
                <p className="text-muted-foreground">Request ID: {requestData.id}</p>
            </div>

            {/* Content Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Request Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="p-2">
                                <FileText className="h-5 w-5 text-white" />
                            </div>
                            Request Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Request Type</p>
                                <p className="font-medium">{requestData.type}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Priority</p>
                                <Badge className="bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {requestData.status}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Priority</p>
                                <Badge 
                                    variant="secondary"
                                    className={getPriorityColor(requestData.priority)}
                                >
                                    {requestData.priority}
                                </Badge>
                            </div>
                        </div>
                        
                        <div>
                            <p className="text-sm text-muted-foreground">Description</p>
                            <p className="text-sm mt-1">{requestData.description}</p>
                        </div>
                        
                        <div>
                            <p className="text-sm text-muted-foreground">Additional Notes</p>
                            <p className="text-sm mt-1">{requestData.additionalNotes}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Artist Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="p-2 ">
                                <User className="h-5 w-5 text-white" />
                            </div>
                            Artist Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{artistData.name}</p>
                        </div>
                        
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="text-sm">{artistData.email}</p>
                        </div>
                        
                        <div>
                            <p className="text-sm text-muted-foreground">Member Since</p>
                            <p className="text-sm">{artistData.memberSince}</p>
                        </div>
                        
                        <div>
                            <p className="text-sm text-muted-foreground">Total Artworks</p>
                            <p className="text-sm">{artistData.totalArtworks}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default RequestDetailInfo
