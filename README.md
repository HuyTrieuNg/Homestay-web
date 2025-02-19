# Home-stay-web

## 1. Clone Repository

```sh
git clone https://github.com/HuyTrieuNg/Homestay-web.git
cd Homestay-web
```

## 2. Cài đặt Dependency

### Backend (Django)

1. Tạo và kích hoạt virtual environment:
    ```sh
    python -m venv venv
    source venv/bin/activate  # Trên macOS/Linux
    venv\Scripts\activate  # Trên Windows
    ```
2. Cài đặt các package cần thiết:
    ```sh
    pip install -r backend/requirements.txt
    ```

### Frontend (React)

1. Chuyển vào thư mục frontend:
    ```sh
    cd frontend
    ```
2. Cài đặt các package:
    ```sh
    npm install
    ```

## 3. Thiết lập Biến Môi Trường

Tạo file `.env` trong thư mục `backend/` với nội dung như sau:

```sh
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123456
DB_NAME=homestay_web
```

## 4. Chạy MySQL với Docker

1. Quay lại thư mục gốc của project:
    ```sh
    cd ..
    ```
2. Xây dựng và chạy container:

    ```sh
    docker-compose up -d --build
    ```

3. Dừng Docker Container

```sh
docker-compose down
```
