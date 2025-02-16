
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from .models import Account

class TokenVerificationMixin:
    def verify_token(self, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = Account.objects.get(pk=uid)
            is_valid = default_token_generator.check_token(user, token)

            print("From Mixin, valid: ", is_valid)
            return{
                'success': True,
                'user': user,
                'is_valid': is_valid
            }
        except (TypeError, ValueError, OverflowError, Account.DoesNotExist) as e:
            print(f"Token verification error: {str(e)}")
            return {
                'success': False,
                'error': 'Invalid verification link'
            }