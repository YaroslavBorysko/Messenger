FROM python:3.11
ENV PYTHONUNBUFFERED=1
WORKDIR /app

RUN apt-get update

COPY requirements.txt requirements.txt

RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

COPY . /app
EXPOSE 8080

CMD ["python", "manage.py", "maigrate"]

CMD ["daphne","-b", "0.0.0.0", "messenger.asgi:application", "-p", "8080"]