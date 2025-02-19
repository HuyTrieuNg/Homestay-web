FROM python:3.13

WORKDIR /app

COPY . .

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "manage.py", "runserver" , "0.0.0.0:8000"]