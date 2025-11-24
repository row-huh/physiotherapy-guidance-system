"""WebSocket server to receive Base64 JPEG frames from the mobile client.

Run:
    pip install websockets
    python frame_server.py

Client sends raw Base64 strings or JSON over WebSocket.
"""
import asyncio
import websockets
import time
import base64
import cv2
import numpy as np

# CONFIG
PORT = 5001

frames_received = 0
start_time = time.time()

async def handler(websocket):
    global frames_received, start_time
    print(f"[NEW CONNECTION] {websocket.remote_address}")
    
    try:
        async for message in websocket:
            # message is the frame data
            frames_received += 1
            
            # Decode and display
            try:
                img_bytes = base64.b64decode(message)
                nparr = np.frombuffer(img_bytes, np.uint8)
                frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                
                if frame is not None:
                    cv2.imshow("Live Feed", frame)
                    # Press 'q' to close window (though loop continues)
                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        pass
            except Exception as e:
                print(f"[DECODE ERROR] {e}")

            if frames_received % 10 == 0:
                elapsed = time.time() - start_time
                fps = frames_received / elapsed if elapsed > 0 else 0
                print(f"[INFO] Frames: {frames_received} | FPS: {fps:.2f}")
                
    except websockets.exceptions.ConnectionClosed:
        print("[DISCONNECTED]")
    except Exception as e:
        print(f"[ERROR] {e}")
    finally:
        cv2.destroyAllWindows()

async def main():
    print(f"Starting WebSocket server on 0.0.0.0:{PORT}")
    # Set max_size to None to allow large frames if needed
    async with websockets.serve(handler, "0.0.0.0", PORT, max_size=None) as server:
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
