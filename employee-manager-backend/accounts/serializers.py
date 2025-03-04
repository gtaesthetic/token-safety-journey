
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Employee, Manager

User = get_user_model()

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['department', 'position', 'leave_balance']

class ManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manager
        fields = ['managed_department']

class UserSerializer(serializers.ModelSerializer):
    employee_profile = EmployeeSerializer(required=False)
    manager_profile = ManagerSerializer(required=False)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'password', 
                 'date_joined', 'employee_profile', 'manager_profile']
        extra_kwargs = {
            'password': {'write_only': True},
            'date_joined': {'read_only': True},
        }
    
    def create(self, validated_data):
        role = validated_data.get('role', 'employee')
        
        # Extract nested profile data
        employee_profile_data = None
        manager_profile_data = None
        
        if 'employee_profile' in validated_data:
            employee_profile_data = validated_data.pop('employee_profile')
            
        if 'manager_profile' in validated_data:
            manager_profile_data = validated_data.pop('manager_profile')
        
        # Create the user
        user = User.objects.create_user(**validated_data)
        
        # Create the appropriate profile based on role
        if role == 'employee' and employee_profile_data:
            Employee.objects.create(user=user, **employee_profile_data)
        elif role == 'manager' and manager_profile_data:
            Manager.objects.create(user=user, **manager_profile_data)
        
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class TokenResponseSerializer(serializers.Serializer):
    token = serializers.CharField()
    user = UserSerializer(read_only=True)
