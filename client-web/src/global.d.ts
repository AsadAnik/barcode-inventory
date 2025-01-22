declare module "react-qr-barcode-scanner" {
    import { ComponentType } from "react";
  
    interface BarcodeScannerComponentProps {
      onUpdate: (err: unknown, result: { text: string } | null) => void;
      [key: string]: any; // Add additional props as needed
    }
  
    const BarcodeScannerComponent: ComponentType<BarcodeScannerComponentProps>;
  
    export default BarcodeScannerComponent;
  }
  