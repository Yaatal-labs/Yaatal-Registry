# Dockerfile for MOSS-Audio fine-tuning on HF Jobs or local GPU
# Base: NVIDIA CUDA 12.4 with Python 3.11
FROM nvidia/cuda:12.4.1-cudnn-devel-ubuntu22.04

# Prevent interactive prompts
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3.11 \
    python3.11-venv \
    python3.11-dev \
    git \
    ffmpeg \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Create symlinks for python3.11
RUN ln -sf /usr/bin/python3.11 /usr/bin/python3 && \
    ln -sf /usr/bin/python3.11 /usr/bin/python

# Upgrade pip
RUN python3 -m pip install --upgrade pip setuptools wheel

# Create virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install PyTorch with CUDA 12.4 support
RUN pip install torch==2.4.0 torchvision==0.19.0 torchaudio==2.4.0 --index-url https://download.pytorch.org/whl/cu124

# Install requirements
COPY requirements.txt /workspace/requirements.txt
WORKDIR /workspace
RUN pip install -r requirements.txt

# Install flash-attn for faster attention (optional, requires compatible GPU)
# RUN pip install flash-attn==2.5.8 --no-build-isolation

# Copy training script
COPY train_moss_audio.py /workspace/train_moss_audio.py

# Create non-root user for security
RUN useradd -m -u 1000 trainer && chown -R trainer:trainer /workspace
USER trainer

# Default command (override with HF Jobs command)
CMD ["python", "train_moss_audio.py", "--help"]