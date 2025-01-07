
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Example mock color-mode hook.
 * Replace with your real color-mode logic for toggling classes or context.
 */
function useColorMode() {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const toggleColorMode = (newMode: string) => {
    if (newMode === "dark") {
      setMode("dark");
      // e.g. document.documentElement.classList.add('dark')
    } else {
      setMode("light");
      // e.g. document.documentElement.classList.remove('dark')
    }
  };

  return { colorMode: mode, toggleColorMode };
}

export default function Appearance() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="py-4 text-sm">Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          {/* ShadCN UI's RadioGroup uses onValueChange instead of onChange */}
          <RadioGroup
            value={colorMode}
            onValueChange={toggleColorMode}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light" className="flex items-center space-x-2">
                <span>Light Mode</span>
                <Badge variant="outline" className="ml-1">
                  Default
                </Badge>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark Mode</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
