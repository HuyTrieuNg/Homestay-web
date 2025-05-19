#!/usr/bin/env bash
# exit on error
set -o errexit

# Cài đặt các gói phụ thuộc
pip install -r requirements.txt

# Thu thập static files
python manage.py collectstatic --no-input

# Áp dụng các migration cho database
python manage.py migrate