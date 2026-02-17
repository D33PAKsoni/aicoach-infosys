import math

def get_eye_direction(landmarks, frame_width):
    left_corner = landmarks[33].x * frame_width
    right_corner = landmarks[133].x * frame_width
    iris = landmarks[468].x * frame_width

    denom = right_corner - left_corner
    if denom <= 1e-6:
        return "Center"

    ratio = (iris - min(left_corner, right_corner)) / denom

    if ratio < 0.35:
        return "Left"
    elif ratio > 0.65:
        return "Right"
    else:
        return "Center"


def get_head_pose(matrix):
    if matrix is None:
        return 0.0, 0.0, 0.0

    yaw = math.degrees(math.atan2(matrix[0][2], matrix[2][2]))
    pitch = math.degrees(math.atan2(-matrix[1][2], matrix[2][2]))
    roll = math.degrees(math.atan2(matrix[1][0], matrix[0][0]))

    return yaw, pitch, roll


def detect_cheating(yaw, pitch):
    if abs(yaw) > 12:
        return True
    if abs(pitch) > 12:
        return True
    return False
