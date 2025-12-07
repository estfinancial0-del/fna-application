import { useRef, useEffect, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface SignaturePadProps {
  label: string;
  value?: string;
  onChange: (signature: string) => void;
  required?: boolean;
  error?: string;
}

export function SignaturePad({ label, value, onChange, required, error }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load existing signature only once on mount, not on every value change
  useEffect(() => {
    if (value && sigCanvas.current && !isInitialized && !sigCanvas.current.isEmpty()) {
      // Only load if canvas is empty to prevent duplication
      return;
    }
    if (value && sigCanvas.current && !isInitialized) {
      sigCanvas.current.clear(); // Clear first to prevent duplication
      sigCanvas.current.fromDataURL(value);
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  const handleClear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setIsInitialized(false);
      onChange("");
    }
  };

  const handleEnd = () => {
    if (sigCanvas.current) {
      const dataURL = sigCanvas.current.toDataURL();
      onChange(dataURL);
    }
  };

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-red-600">*</span>}
      </Label>
      <div className="border-2 border-gray-300 rounded-lg bg-white relative">
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            className: "w-full h-32 cursor-crosshair",
            style: { touchAction: "none" }
          }}
          onEnd={handleEnd}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      </div>
      {!value && (
        <p className="text-sm text-gray-500">Sign above using your mouse or touch screen</p>
      )}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
