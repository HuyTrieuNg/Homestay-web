from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from .models import Homestay, PropertyType, Amenity, Province, District, Commune
from booking.models import Booking, HomestayAvailability
from .serializers import *
from django.db.models import Count, Q, Avg
from users.permissions import IsAdmin
from rest_framework import viewsets
from rest_framework.decorators import action
from datetime import datetime, timezone, timedelta
from django.utils import timezone as django_timezone
from users.models import User
from users.serializer import UserSerializer
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 24

# class HomestayListView(APIView):
#     permission_classes = [AllowAny]

#     def get(self, request):
#         property_type_id = request.query_params.get('property_type_id', None)
#         province = request.query_params.get('province', None)
#         max_guests = request.query_params.get('max_guest_lte', None)  # Lấy giá trị max_guest từ query

#         homestays = Homestay.objects.select_related(
#             'type', 'commune__district__province'
#         ).prefetch_related(
#             'images', 
#             'amenities'
#         )

#         if property_type_id:
#             homestays = homestays.filter(type_id=property_type_id)
            
#         if province:
#             print("Province filter value:", province)
#             homestays = homestays.filter(commune__district__province__name__icontains=province)

#         if max_guests:
#             try:
#                 max_guests = int(max_guests)
#                 homestays = homestays.filter(max_guests__gte=max_guests)
#             except ValueError:
#                 return Response({"error": "Invalid max_guest value"}, status=status.HTTP_400_BAD_REQUEST)

#         serializer = HomestaySerializer(homestays, many=True, context={'request': self.request})
#         return Response(serializer.data)


class HomestayListView(APIView):
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    
    def get(self, request):
        try:
            property_type_id = request.query_params.get('property_type_id', None)
            province = request.query_params.get('province', None)
            max_guests = request.query_params.get('max_guest_lte', None)  # Lấy giá trị max_guest từ query
    
            homestays = Homestay.objects.select_related(
                'type', 'commune__district__province'
            ).prefetch_related(
                'images', 
                'amenities'
            )
            
            
            if property_type_id:
                homestays = homestays.filter(type_id=property_type_id)
                
            if province:
                print("Province filter value:", province)
                homestays = homestays.filter(commune__district__province__name__icontains=province)
    
            if max_guests:
                try:
                    max_guests = int(max_guests)
                    homestays = homestays.filter(max_guests__gte=max_guests)
                except ValueError:
                    return Response({"error": "Invalid max_guest value"}, status=status.HTTP_400_BAD_REQUEST)
            homestays = homestays.order_by('base_price')
            # Thêm phân trang
            paginator = self.pagination_class()
            result_page = paginator.paginate_queryset(homestays, request)
            
            if result_page is not None:
                serializer = HomestayListLiteSerializer(result_page, many=True, context={'request': request})
                return paginator.get_paginated_response(serializer.data)
            
            # Fallback nếu không phân trang được
            serializer = HomestayListLiteSerializer(homestays, many=True, context={'request': request})
            return Response(serializer.data)
            
        except Exception as e:
            # Log lỗi nhưng không làm crash API
            import traceback
            print(f"Error in HomestayListView: {str(e)}")
            print(traceback.format_exc())
            
            # Trả về danh sách trống nhưng định dạng tương tự như response có phân trang
            return Response({
                "count": 0,
                "next": None,
                "previous": None,
                "results": []
            })

    
class HomestayDetailView(RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = Homestay.objects.all()
    serializer_class = HomestaySerializer

class PropertyTypeListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        property_types = PropertyType.objects.all()
        serializer = PropertitypeSerializer(property_types, many=True)
        return Response(serializer.data)
    
class AmenitiesListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        amenities = Amenity.objects.all()
        serializer = AmenitySerializer(amenities, many=True)
        return Response(serializer.data)

class ProvincesListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        provinces = Province.objects.all()
        serializer = ProvinceSerializer(provinces, many=True)
        return Response(serializer.data)
    
class DistrictsListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        districts = District.objects.all()
        serializer = DistrictSerializer(districts, many=True)
        return Response(serializer.data)
    
class CommunesListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        communes = Commune.objects.all()
        serializer = CommuneSerializer(communes, many=True)
        return Response(serializer.data)
        
class MaxGuestView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        homestay = Homestay.objects.get(pk=pk)
        max_guests = homestay.max_guests
        return Response({"max_guests": max_guests})
    

class HomestayStatisticsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        # Tổng số homestay
        total_homestays = Homestay.objects.count()

        # Thống kê theo loại phòng
        homestay_by_type = Homestay.objects.values('type__name').annotate(count=Count('id')).order_by('type__name')

        # Trả về kết quả
        return Response({
            "total_homestays": total_homestays,
            "homestays_by_type": [{"type": item['type__name'], "count": item['count']} for item in homestay_by_type]
        })
    
class HomestayDeleteView(APIView):
    permission_classes = [IsAdmin]

    def delete(self, request, pk):
        try:
            homestay = Homestay.objects.get(pk=pk)
            homestay.delete()
            return Response({'detail': 'Homestay deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except Homestay.DoesNotExist:
            return Response({'error': 'Homestay not found.'}, status=status.HTTP_404_NOT_FOUND)
        
class PropertyTypeView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        serializer = PropertyTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            property_type = PropertyType.objects.get(pk=pk)
        except PropertyType.DoesNotExist:
            return Response({'error': 'Property type not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PropertyTypeSerializer(property_type, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AmenityView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        serializer = AmenitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            amenity = Amenity.objects.get(pk=pk)
        except Amenity.DoesNotExist:
            return Response({'error': 'Amenity not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = AmenitySerializer(amenity, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class HomestaySearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            # Get search parameters
            address = request.query_params.get('address', '')
            start_date = request.query_params.get('start_date')
            end_date = request.query_params.get('end_date')
            guests = request.query_params.get('guests', 1)

            # Validate required parameters
            if not address:
                return Response(
                    {"error": "Địa điểm là bắt buộc"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not start_date or not end_date:
                return Response(
                    {"error": "Ngày nhận và trả phòng là bắt buộc"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Base queryset
            queryset = Homestay.objects.select_related(
                'type', 'commune__district__province'
            ).prefetch_related('images', 'amenities')

            # Filter by address (search in address field)
            if address:
                queryset = queryset.filter(
                    Q(address__icontains=address) |
                    Q(commune__name__icontains=address) |
                    Q(commune__district__name__icontains=address) |
                    Q(commune__district__province__name__icontains=address)
                )

            # Filter by max guests
            if guests:
                try:
                    guests = int(guests)
                    queryset = queryset.filter(max_guests__gte=guests)
                except ValueError:
                    return Response(
                        {"error": "Số khách không hợp lệ"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Filter by availability
            if start_date and end_date:
                try:
                    # Parse dates
                    start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
                    end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
                    today = django_timezone.now().date()

                    # Kiểm tra ngày hợp lệ
                    if start_date >= end_date:
                        return Response(
                            {"error": "Ngày trả phòng phải sau ngày nhận phòng"}, 
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    
                    if start_date < today:
                        return Response(
                            {"error": "Ngày nhận phòng không được trong quá khứ"}, 
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    # Tạo danh sách các ngày cần kiểm tra
                    date_range = []
                    current_date = start_date
                    while current_date <= end_date:
                        date_range.append(current_date)
                        current_date += timedelta(days=1)

                    # Lấy danh sách homestay có ngày bận trong khoảng thời gian này
                    unavailable_homestays = HomestayAvailability.objects.filter(
                        date__in=date_range,
                        status__in=['booked', 'blocked']
                    ).values_list('homestay_id', flat=True).distinct()

                    # Loại bỏ các homestay không khả dụng
                    queryset = queryset.exclude(id__in=unavailable_homestays)

                except ValueError:
                    return Response(
                        {"error": "Định dạng ngày không hợp lệ. Sử dụng YYYY-MM-DD"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Serialize and return results
            serializer = HomestaySerializer(queryset, many=True, context={'request': request})
            return Response(serializer.data)

        except Exception as e:
            print(f"Search error: {str(e)}")  # Debug log
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class HostByHomestayView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, homestay_id):
        homestay = Homestay.objects.filter(id=homestay_id).select_related('host').first()
        if not homestay or not homestay.host:
            return Response({"error": "Homestay or host not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(homestay.host, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
