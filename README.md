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

## 3. Chạy với Docker
1. Quay lại thư mục gốc của project:
   ```sh
   cd ..
   ```
2. Xây dựng và chạy container:
   ```sh
   docker-compose up -d --build
   ```
3. Truy cập ứng dụng:
   - Backend API: http://localhost:8000
   - Frontend: http://localhost:5173

## 4. Dừng Docker Container
```sh
docker-compose down
```

