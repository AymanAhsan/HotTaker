from django.contrib import admin
from django.urls import path
from .views import SignUpView, LoginView, VerifyEmailView, LogoutView, ChangeUsernameView, VerifyNewEmailView, ChangeEmailView, SendPasswordEmailView, VerifyPasswordResetView, ChangePasswordView, ForgetPasswordView


urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('verify/<str:uidb64>/<str:token>/', VerifyEmailView.as_view(), name='verify_email'),
    path('verify-email/<str:uidb64>/<str:token>/', VerifyNewEmailView.as_view(), name='verify_new_email'),
    path('change-username/', ChangeUsernameView.as_view(), name='change_username'),
    path('change-email/', ChangeEmailView.as_view(), name='change_email'),
    path('change-password-request/', SendPasswordEmailView.as_view(), name='password-reset-request'),
    path('reset-password/<str:uidb64>/<str:token>/', VerifyPasswordResetView.as_view(), name='verify-password-reset'),
    path('reset-password/reset/', ChangePasswordView.as_view(), name='password-reset'),
    path('forget-password/', ForgetPasswordView.as_view(), name='forget-password'),
]
