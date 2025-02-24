from rest_framework import serializers
from .models import Account
from .backend import EmailBackend

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            'id', 
            'username',
            'email',
            'pfp',
            'status',
            'bio',
            'created_at',
            'updated_at'
        ]


class SignUpSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    
    class Meta:
        model = Account
        fields = ['username', 'email', 'password1', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        errors = {}
        if data['password1'] != data['password2']:
            errors['password'] = "Passwords do not match"
        if Account.objects.filter(email=data['email']).exists():
            errors['email'] = "Email already exists"
        if Account.objects.filter(username=data['username']).exists():
            errors['username'] = "Username already exists"
        
        if errors:
            raise serializers.ValidationError(errors)
        return data
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        errors = {}

        if not email or not password:
            errors['blank'] = 'Email or Password field left blank'
            raise serializers.ValidationError(errors)

        backend = EmailBackend()
        user = backend.authenticate(request=None, email=email, password=password)

        if user is None:
            errors['credentials'] = 'Invalid credentials'
            raise serializers.ValidationError(errors)

        if not user.is_active:
            errors['account'] = 'Account is not active'
            raise serializers.ValidationError(errors)
            
        data['user'] = user
        return data
    
class ChangeUsernameSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        errors = {}

        if not username or not password:
            errors['blank'] = 'Username or Password field left blank'
            raise serializers.ValidationError(errors)
        if Account.objects.filter(username=username).exists():
            errors['username'] = 'Username already exists'
            raise serializers.ValidationError(errors)
        if not self.context['request'].user.check_password(password):
            errors['password'] = 'Incorrect password'
            raise serializers.ValidationError(errors)
        return data
        
class ChangeEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        errors = {}

        if not email or not password:
            errors['blank'] = 'Email or Password field left blank'
            raise serializers.ValidationError(errors)
        if Account.objects.filter(email=email).exists():
            errors['email'] = 'Email already exists'
            raise serializers.ValidationError(errors)
        if not self.context['request'].user.check_password(password):
            errors['password'] = 'Incorrect password'
            raise serializers.ValidationError(errors)
        return data

class ChangePasswordSerializer(serializers.Serializer):
    password1 = serializers.CharField()
    password2 = serializers.CharField()
    
    def validate(self, data):
        password1 = data.get('password1')
        password2 = data.get('password2')

        errors = {}

        if password1 != password2:
            errors['password'] = 'Passwords do not match'
            raise serializers.ValidationError(errors)
        if not password1 or not password2:
            errors['blank'] = 'Password field left blank'
            raise serializers.ValidationError(errors)
        return data

class ForgetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, data):
        email = data.get('email')
        errors = {}
        if not email:
            errors['blank'] = 'Email field left blank'
            raise serializers.ValidationError(errors)
        if not Account.objects.filter(email=email).exists():
            errors['email'] = 'Email does not exist'
            raise serializers.ValidationError(errors)
        return data