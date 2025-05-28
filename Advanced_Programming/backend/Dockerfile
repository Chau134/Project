FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/credit.cpp ./

COPY backend/requirements.txt ./

RUN g++ -o credit credit.cpp

RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./ 

EXPOSE 8000

ENV PORT=8000 

CMD ["python", "server.py"]