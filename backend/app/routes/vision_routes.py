# import base64
# import cv2
# import numpy as np
# from PIL import Image
# from collections import deque
# from fastapi import APIRouter, WebSocket
# from vision.face_pipeline import analyze_face, crop_face
# from vision.emotion_model import predict_emotion
# from vision.behavior_metrics import get_interview_prediction
# from vision.gaze_and_pose import get_eye_direction, get_head_pose, detect_cheating

# router = APIRouter()

# @router.websocket("/ws/vision")
# async def vision_ws(websocket: WebSocket):
#     await websocket.accept()
#     emotion_buffer = deque(maxlen=5)

#     try:
#         while True:
#             data = await websocket.receive_text()
#             img_bytes = base64.b64decode(data)
#             np_arr = np.frombuffer(img_bytes, np.uint8)
#             frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

#             face_data = analyze_face(frame)
#             behavior, eye_direction, yaw, pitch, roll, possible_cheating = "No Face", "Unknown", 0, 0, 0, False

#             if face_data["face_detected"]:
#                 face_crop = crop_face(frame, face_data["landmarks"][0])
#                 if face_crop is not None and face_crop.size != 0:
#                     face_crop = cv2.cvtColor(cv2.cvtColor(face_crop, cv2.COLOR_BGR2GRAY), cv2.COLOR_GRAY2RGB)
#                     probs = predict_emotion(Image.fromarray(face_crop))
#                     emotion_buffer.append(probs.cpu().numpy())
#                     behavior = get_interview_prediction(np.mean(emotion_buffer, axis=0))
#                     eye_direction = get_eye_direction(face_data["landmarks"][0], frame.shape[1])
#                     yaw, pitch, roll = get_head_pose(face_data["transform_matrix"])
#                     possible_cheating = detect_cheating(yaw, pitch)

#             await websocket.send_json({
#                 "faceDetected": face_data["face_detected"],
#                 "eyeDirection": eye_direction,
#                 "behaviorMetric": behavior,
#                 "headPose": {"yaw": round(yaw, 2), "pitch": round(pitch, 2), "roll": round(roll, 2)},
#                 "possibleCheating": possible_cheating
#             })
#     except Exception as e:
#         await websocket.close()


import base64
import cv2
import numpy as np
import anyio  # Added for asynchronous thread management
from PIL import Image
from collections import deque
from fastapi import APIRouter, WebSocket
from vision.face_pipeline import analyze_face, crop_face
from vision.emotion_model import predict_emotion
from vision.behavior_metrics import get_interview_prediction
from vision.gaze_and_pose import get_eye_direction, get_head_pose, detect_cheating

router = APIRouter()

@router.websocket("/ws/vision")
async def vision_ws(websocket: WebSocket):
    await websocket.accept()
    emotion_buffer = deque(maxlen=5)

    try:
        while True:
            # Receive image frame from client
            data = await websocket.receive_text()
            img_bytes = base64.b64decode(data)
            np_arr = np.frombuffer(img_bytes, np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            # Offload heavy MediaPipe analysis to a separate thread
            face_data = await anyio.to_thread.run_sync(analyze_face, frame)
            
            behavior, eye_direction, yaw, pitch, roll, possible_cheating = "No Face", "Unknown", 0, 0, 0, False

            if face_data["face_detected"]:
                face_crop = crop_face(frame, face_data["landmarks"][0])
                if face_crop is not None and face_crop.size != 0:
                    # Pre-process for emotion model
                    face_crop = cv2.cvtColor(cv2.cvtColor(face_crop, cv2.COLOR_BGR2GRAY), cv2.COLOR_GRAY2RGB)
                    pil_img = Image.fromarray(face_crop)
                    
                    # Offload PyTorch inference to a separate thread
                    probs = await anyio.to_thread.run_sync(predict_emotion, pil_img)
                    
                    emotion_buffer.append(probs.cpu().numpy())
                    behavior = get_interview_prediction(np.mean(emotion_buffer, axis=0))
                    eye_direction = get_eye_direction(face_data["landmarks"][0], frame.shape[1])
                    yaw, pitch, roll = get_head_pose(face_data["transform_matrix"])
                    possible_cheating = detect_cheating(yaw, pitch)

            # Send results back asynchronously
            await websocket.send_json({
                "faceDetected": face_data["face_detected"],
                "eyeDirection": eye_direction,
                "behaviorMetric": behavior,
                "headPose": {"yaw": round(yaw, 2), "pitch": round(pitch, 2), "roll": round(roll, 2)},
                "possibleCheating": possible_cheating
            })
    except Exception as e:
        print(f"Vision WebSocket Error: {e}")
        await websocket.close()