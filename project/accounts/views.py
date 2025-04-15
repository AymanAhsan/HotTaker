from django.contrib.auth import login as auth_login, logout
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializer import *
from .EmailService import EmailService
from .Tokens import TokenVerificationMixin

# Create your views here.

class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignUpSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = Account.objects.create_user(
                email=serializer.validated_data['email'],
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password1']
            )
            email_service = EmailService() # Dont trust it
            email_service.send_verification_email(user)
            return Response(AccountSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            print("user is logged in")
            user = serializer.validated_data['user']
            auth_login(request, user, backend='accounts.backend.EmailBackend')
            print("user authenticated: ", request.user.is_authenticated)
            return Response(AccountSerializer(user).data)
        else:
            print("user is not logged in")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(APIView, TokenVerificationMixin):
    print("the other verify email view")
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
         permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        result = self.verify_token(uidb64, token)
        if not result['success']:
            return Response({'error': result['error']}, status=status.HTTP_400_BAD_REQUEST)

        user = result['user']
        if result['is_valid']:
            user.is_active = True
            user.save()
            return Response({'success': True})
        return Response({'error': 'Invalid verification link'}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        logout(request)
        return Response({'success': True})

class ChangeUsernameView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangeUsernameSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.username = serializer.validated_data['username']
            user.save()
            return Response(AccountSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ChangeEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangeEmailSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            new_email = serializer.validated_data['email']

            user.pending_email = new_email
            user.save()
            
            email_service = EmailService()
            email_service.send_change_email_verification_email(user)
            return Response(AccountSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyNewEmailView(APIView, TokenVerificationMixin):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        result = self.verify_token(uidb64, token)
        
        if not result['success']:
            return Response(
                {
                    'error': result['error']
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        if not result['is_valid']:
            return Response(
                {'error': 'The verification link has expired'},
            )
            
        user = result['user']
        user.email = user.pending_email
        user.pending_email = None
        user.email_verification_token = None
        user.email_token_created = None
        user.save()
        
        return Response({'success': True}, status=status.HTTP_200_OK)

class SendPasswordEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            email_service = EmailService()
            email_service.send_password_reset_email(user)
            return Response({'success': True, 'message': 'Password reset email sent'})
        except Exception as e:
            return Response(
                {'error': 'Failed to send reset email'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class VerifyPasswordResetView(APIView, TokenVerificationMixin):
    print("verify password reset")
    def get(self, request, uidb64, token):
        result = self.verify_token(uidb64, token)

        if not result['success']:
            return Response(
                {
                    'error': result['error']
                }, status=status.HTTP_400_BAD_REQUEST
            )
        if not result['is_valid']:
            return Response(
                {'error': 'The verification link has expired'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if result['is_valid']:
            print("valid token")
            return Response({'success': True})

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    print("change password")

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['password1'])
            user.save()
            return Response({'success': True})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ForgetPasswordView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = ForgetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = Account.objects.get(email=email)
            email_service = EmailService()
            email_service.send_password_reset_email(user)
            return Response({'success': True})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DeleteAccountSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            print("user deleted")
            user.delete()
            return Response({'success': True})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangeStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangeStatusSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            user.status = serializer.validated_data['status']
            user.save()
            return Response(AccountSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangeBioView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangeBioSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            user.bio = serializer.validated_data['bio']
            user.save()
            return Response(AccountSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)