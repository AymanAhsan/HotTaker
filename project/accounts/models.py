from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser

# Create your models here.

class AccountManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        if not username:
            raise ValueError("Users must have a username")

        user = self.model(
            email=self.normalize_email(email),
            username=username,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user
    
class Account(AbstractBaseUser):
    username = models.CharField(max_length=50)
    email = models.EmailField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    pfp = models.ImageField(upload_to='images/', default='images/default.jpg')
    status = models.CharField(max_length=50, default='')
    bio = models.TextField(max_length=500, default='')
    is_active = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    phone = models.CharField(max_length=15, default='')

    # For changing email purposes

    pending_email = models.EmailField(blank = True, null = True)
    email_verification_token = models.CharField(max_length=100, blank=True, null=True)
    email_token_created = models.DateTimeField(blank=True, null=True)
    

    objects = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username