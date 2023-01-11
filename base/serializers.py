from rest_framework import serializers
from .models import *

# class CompanySerializer(serializers.ModelSerializer):
#     employee_count = serializers.SerializerMethodField(read_only=True)
#     class Meta:
#         model = Company
#         fields = '__all__'

#     def get_employee_count(self, obj):
#         count = obj.advocate_set.count()
#         return count


class PaginationSerializer(serializers.Serializer):
    current_page = serializers.IntegerField()
    total_pages = serializers.IntegerField()
    pages = serializers.ListField(child=serializers.IntegerField())
    has_previous = serializers.BooleanField()
    has_next = serializers.BooleanField()
    prev_page = serializers.IntegerField(allow_null=True)
    next_page = serializers.IntegerField(allow_null=True)
    results_found = serializers.IntegerField()

class AdvocateSerializer(serializers.ModelSerializer):
    # company = CompanySerializer()
    class Meta:
        model = Advocate
        fields = ['name', 'username', 'profile_pic', 'bio', 'id', 'twitter']

class AdvocatesListSerializer(serializers.Serializer):
    pagination = PaginationSerializer()
    total = serializers.IntegerField()
    advocates = AdvocateSerializer(many=True)