from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.utils.html import strip_tags

class EmailService:
    def __init__(self):
        self.from_email = settings.EMAIL_HOST_USER

    def send_verification_email(self, user):
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        verification_link = f"{settings.FRONTEND_URL}/verify/{uid}/{token}"
        
        subject = 'Verify your email'
        message = render_to_string('accounts/verify_email.html', {'link': verification_link})
        plain_message = strip_tags(message)
        
        self._send_email(subject, plain_message, user.email, message)
        print(f"Verification email sent to {user.email}")
    
    def send_change_email_verification_email(self, user):
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        verification_link = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}"
        
        subject = 'Verify your new email'
        message = render_to_string('accounts/verify_email.html', {'link': verification_link})
        plain_message = strip_tags(message)
        
        self._send_email(subject, plain_message, user.pending_email, message)
        print(f"Verification email sent to {user.pending_email}")
    
    def send_password_reset_email(self, user):
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"
        
        subject = 'Reset your password'
        message = render_to_string('accounts/reset_password.html', {'link': reset_link})
        plain_message = strip_tags(message)
        
        self._send_email(subject, plain_message, user.email, message)
        print(f"Password reset email sent to {user.email}")

    def _send_email(self, subject, plain_message, to_email, html_message=None):
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=self.from_email,
            recipient_list=[to_email],
            html_message=html_message,
            fail_silently=False
        )