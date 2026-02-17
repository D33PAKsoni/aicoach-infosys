import cv2
import mediapipe as mp
from mediapipe.tasks.python import vision
# from scipy.datasets import face

BaseOptions = mp.tasks.BaseOptions
FaceLandmarker = vision.FaceLandmarker
FaceLandmarkerOptions = vision.FaceLandmarkerOptions

options = FaceLandmarkerOptions(
    base_options=BaseOptions(model_asset_path="models/face_landmarker.task"),
    output_face_blendshapes=True,
    output_facial_transformation_matrixes=True,
    num_faces=1
)

face_landmarker = FaceLandmarker.create_from_options(options)

def analyze_face(frame):
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
    result = face_landmarker.detect(mp_image)

    return {
        "face_detected": len(result.face_landmarks) > 0,
        "eye_tracked": len(result.face_landmarks) > 0,
        "landmarks": result.face_landmarks,
        "transform_matrix": (
            result.facial_transformation_matrixes[0]
            if result.facial_transformation_matrixes
            else None
        )
    }

def crop_face(frame, landmarks):
    h, w, _ = frame.shape
    xs = [int(p.x * w) for p in landmarks]
    ys = [int(p.y * h) for p in landmarks]

    x1 = max(min(xs) - 20, 0)
    x2 = min(max(xs) + 20, w)
    y1 = max(min(ys) - 20, 0)
    y2 = min(max(ys) + 20, h)

    face = frame[y1:y2, x1:x2]
    if face.size == 0:
        return None
    return face

