# Caught ml-service (FastAPI). Layer 0: /health only.
# python:3.12-slim is a safe, wheel-rich base for the light Layer 0 deps. The
# base image / Python version is revisited in K1 when scikit-learn 1.8.0 and the
# joblib models load, since unpickling is sensitive to the runtime (library-docs.md).
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
