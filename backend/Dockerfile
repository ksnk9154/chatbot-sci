FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Create index directory
RUN mkdir -p index

# Build the index (this will run when container starts if data exists)
# Note: In production, you'd mount a volume or copy pre-built index
CMD ["python", "app.py"]
