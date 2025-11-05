"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DetailRow = { label: string; value: string | number | React.ReactNode };

interface PayoutDetailSectionProps {
	title: string;
	reference: string;
	backHref: string;
	backLabel?: string;
	headerId: string; // shown as #xxxx in header
	statusBadge?: React.ReactNode;
	rows: DetailRow[];
}

export default function PayoutDetailSection({
	title,
	reference,
	backHref,
	backLabel = "Back",
	headerId,
	statusBadge,
	rows,
}: PayoutDetailSectionProps) {
	return (
		<div className="mx-auto w-full max-w-4xl px-4 md:px-6 py-6">
			<div className="mb-4 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">{title}</h1>
					<p className="text-sm text-muted-foreground">Reference: {reference}</p>
				</div>
				<Link href={backHref} className="text-sm text-primary hover:underline">
					&larr; {backLabel}
				</Link>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-3">
						<span>#{headerId.slice(-8)}</span>
						{statusBadge}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						{rows.map((r, i) => (
							<div key={i}>
								<dt className="text-sm text-muted-foreground">{r.label}</dt>
								<dd className="text-sm">{r.value}</dd>
							</div>
						))}
					</dl>
				</CardContent>
			</Card>
		</div>
	);
}

