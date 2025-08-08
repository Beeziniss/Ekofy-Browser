"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCountStore } from "@/store";
import { Minus, Plus, RotateCcw } from "lucide-react";

export function Counter() {
  const { count, increment, decrement, reset } = useCountStore();

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Counter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <Badge variant="outline" className="px-6 py-3 text-4xl font-bold">
            {count}
          </Badge>
        </div>

        <div className="flex justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => decrement(1)}
            className="h-12 w-12"
          >
            <Minus className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => reset()}
            className="h-12 w-12"
          >
            <RotateCcw className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => increment(1)}
            className="h-12 w-12"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex justify-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => decrement(5)}>
            -5
          </Button>
          <Button variant="secondary" size="sm" onClick={() => decrement(10)}>
            -10
          </Button>
          <Button variant="secondary" size="sm" onClick={() => increment(5)}>
            +5
          </Button>
          <Button variant="secondary" size="sm" onClick={() => increment(10)}>
            +10
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
