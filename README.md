# Physiotherapy Guidance System

[Research Papers]( https://drive.google.com/drive/folders/1QKyY_HpdFIbNe_kM3I0IyrTzue68h_qv?usp=sharing)


Most relevant:
- Gait analysis for rehab: <https://pmc.ncbi.nlm.nih.gov/articles/PMC1421413/>
- Deep learning framework for assesing physical health rehab: <https://pmc.ncbi.nlm.nih.gov/articles/PMC7032994/>
- An Approach for the Evaluation of Human Activities in Physical Therapy Scenarios: https://www.researchgate.net/publication/282926815_An_Approach_for_the_Evaluation_of_Human_Activities_in_Physical_Therapy_Scenarios
-  A Machine Learning App for Monitoring Physical Therapy at Home : https://www.mdpi.com/1424-8220/24/1/158
-  Smartphone-Based Markerless Motion Capture for Accessible Rehabilitation: A Computer Vision Study : https://www.mdpi.com/1424-8220/25/17/5428
- Vision-Based Human Pose Estimation via Deep Learning: A Survey: https://www.researchgate.net/publication/365586128_Vision-Based_Human_Pose_Estimation_via_Deep_Learning_A_Survey


### High level Overview of Deliverables (milestone2)
- a doctor can record a video and upload it
- the video is analysed and posture and elements are extracted from that video and stored in db
- on the patient side, they can view the reference video of themselves
- they then start performing the exercise and through their webcam, a pose estimation model can ensure that the poses they are doing right now are correct. If they're not correct, show an error through text


- react native + expo 

**Very important** : open the `src` folder in vscode, not the parent `physiotherapy-guidance-system` to avoid confusions


[project execution details](https://docs.google.com/document/d/1YLlsXs6PohqPOHPkVtw_cxcwsSvQzb_9BiaVTnScwpc/edit?usp=sharing)

## Live Camera Frame Streaming (Patient Portal)

The patient pose estimation screen now captures frames from the mobile camera and sends them as Base64 JPEG payloads to a Python server endpoint (`POST /frame`).

### How It Works
1. Expo Camera takes a low-quality JPEG every `CAPTURE_INTERVAL_MS` (default 500ms ~2 FPS).
2. Each frame is encoded Base64 client-side and posted to `http://<HOST>:<PORT>/frame`.
3. The Python server decodes bytes and can feed them into a pose estimation pipeline (e.g. MediaPipe, OpenPose, or custom model).

### Python Receiver Example
See `frame_server.py` added in the repo root for a minimal Flask receiver.

### Performance & Tuning Notes
| Aspect | Guidance |
|--------|---------|
| Interval | Lower interval (e.g. 200ms) increases FPS but raises CPU & bandwidth. |
| Quality | `quality: 0.3–0.5` keeps payload size manageable; adjust if model needs more detail. |
| Transport | HTTP POST is simple; switch to WebSocket (binary) or WebRTC for real-time latency-sensitive feedback. |
| Compression | Further resize/downscale before sending if bandwidth is tight. Currently we only lower quality. |
| Backpressure | If server starts lagging, increase interval or implement an async queue with drop-on-overflow semantics. |
| Battery | Long streaming sessions need a Stop button (implemented) and maybe auto-sleep after inactivity. |
| Security | Use HTTPS + auth token headers once moving beyond local dev. |

### Suggested Next Improvements
- Swap to WebSocket streaming (single persistent connection, lower overhead).  
- Integrate pose inference directly on-device (e.g. MediaPipe) to send keypoints instead of raw images (dramatic bandwidth reduction).  
- Add environment-driven server host so dev vs prod differs without code edits.  
- Frame diffing or only sending key frames when movement exceeds threshold.  

### Quick Start (Dev - USB Android, No IP Config Needed)
1. Start Python receiver on your machine (see `frame_server.py`). It listens on port 5001.
2. Plug in an Android device via USB and enable USB debugging.
3. Run:
	```bash
	adb reverse tcp:5001 tcp:5001
	```
	This maps device's 127.0.0.1:5001 to your computer's localhost:5001.
4. Open the patient portal pose estimation screen and tap Start (code already uses `127.0.0.1`).
5. Watch Python server logs for incoming frames.

### iOS Device Alternative
iOS doesn't support an `adb reverse` equivalent. Options:
- Use your computer's LAN IP (e.g. 192.168.x.x) and set `SERVER_HOST` accordingly.
- Use a tunneling service (e.g. ngrok) and point the app at the public HTTPS URL.
- Implement WebRTC or WebSocket connection to a relay server.

---