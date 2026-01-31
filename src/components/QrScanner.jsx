import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

const QrScanner = ({ onScanSuccess, onClose }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (decodedText) => {
        onScanSuccess(decodedText);
        scanner.clear();
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <div id="qr-reader" style={{ width: "300px", margin: "auto" }} />
      <button onClick={onClose} style={{ marginTop: "10px" }}>
        Cancel
      </button>
    </div>
  );
};

export default QrScanner;
