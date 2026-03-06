# Use a Python 3.10 slim image
FROM python:3.10-slim
ENV TZ=UTC

# Install system dependencies for OpenCV, MediaPipe, and Whisper
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    ffmpeg \
    espeak \
    && rm -rf /var/lib/apt/lists/*

# Set up a new user named "user" with user ID 1000 (Required by Hugging Face)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

# Copy requirements and install
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the rest of the backend files (including the 'app' and 'models' folders)
COPY --chown=user . .

# Hugging Face Spaces expects the app to run on port 7860
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860", "--workers", "2"]