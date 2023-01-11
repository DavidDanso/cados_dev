from django.db import models
import uuid

# Create your models here.
class Advocate(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)
    profile_pic = models.CharField(max_length=200, null=True, blank=True)
    username = models.CharField(max_length=200)
    bio = models.TextField(max_length=250, null=True, blank=True)
    twitter = models.CharField(max_length=250, null=True, blank=True)
    updated_time_stamp = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)

    def __str__(self):
        return str(self.username)

    class Meta:
        ordering = ['-updated_time_stamp']


         

