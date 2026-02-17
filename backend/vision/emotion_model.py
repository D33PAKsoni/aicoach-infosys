import torch
from torchvision import transforms, models
# from PIL import Image

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

RAW_CLASSES = {
    0:'Surprise', 1:'Fear', 2:'Disgust',
    3:'Happiness', 4:'Sadness', 5:'Anger', 6:'Neutral'
}

val_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

model = models.resnet18()
model.fc = torch.nn.Linear(model.fc.in_features, 7)
model.load_state_dict(torch.load("models/best_rafdb_model.pth", map_location=DEVICE))
model.to(DEVICE)
model.eval()

def predict_emotion(face_img):
    img = val_transforms(face_img).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        probs = torch.softmax(model(img), dim=1)
    return probs
