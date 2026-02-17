def get_interview_prediction(probs):
    p = probs.tolist()[0]
    scores = {
        "Stressed": p[1] + p[4] + p[0] + p[5],
        "Unprofessional": p[2],
        "Confident": p[3],
        "Composed": p[6]
    }
    return max(scores, key=scores.get)
