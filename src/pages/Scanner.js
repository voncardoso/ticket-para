import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import { useState } from "react";



export default function Scanner(){
    const [scanResult, setScanResult] = useState(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
              width: 400,
              height: 400,
            },
            fps: 5,
          });
      
        scanner.render(success, error);
      
        function success(result){
            scanner.clear();
            setScanResult(result);
        }
      
        function error(err){
            console.warn(err);
        }
      
    },[]);

    
    return (
        <div className="Scanner">
            <h1>Ler QR Code</h1>
            { scanResult
            ? <div>Dados do QR Code: <a href={"http://" + scanResult}>{scanResult}</a></div>
            : <div id="reader"></div>
            }
        </div>
    );
}
