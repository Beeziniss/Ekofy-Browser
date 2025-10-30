import React from 'react'

interface PendingRequestLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

const PendingRequestLayout = ({ children, title, description }: PendingRequestLayoutProps) => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default PendingRequestLayout