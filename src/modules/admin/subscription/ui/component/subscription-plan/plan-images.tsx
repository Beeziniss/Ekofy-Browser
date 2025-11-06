import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";

interface PlanImagesProps {
  images?: string[];
}

export function PlanImages({ images }: PlanImagesProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ImageIcon className="mr-2 h-4 w-4" />
          Images
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {images.map((imageUrl, index) => (
            <div key={index} className="space-y-2">
              <div className="relative h-32 w-full overflow-hidden rounded-lg border">
                <Image
                  src={imageUrl}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                  onError={() => {
                    console.error(`Failed to load image: ${imageUrl}`);
                  }}
                />
              </div>
              <p className="text-xs break-all text-gray-500">{imageUrl}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
