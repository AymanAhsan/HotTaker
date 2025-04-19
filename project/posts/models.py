from django.db import models

# Create your models here.

class Post(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='images/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey('accounts.Account', on_delete=models.CASCADE)
    id = models.AutoField(primary_key=True)

    def __str__(self):
        return self.title