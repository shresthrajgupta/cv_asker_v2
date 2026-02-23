from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

# fmt: off
User = get_user_model()  # gets User model defined in settings.py. In this case User = UserAccount


class Skill(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    proficiency = models.PositiveSmallIntegerField(validators=[MinValueValidator(0), MaxValueValidator(10)], null=False)

    def __str__(self):
        return f'{self.name} ({self.proficiency})'


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile') # delete profile if user is deleted
    skills = models.ManyToManyField(Skill)
    job_profile = models.CharField(max_length=50, blank=False)
    experience_years = models.PositiveIntegerField(validators=[MinValueValidator(0), MaxValueValidator(50)], blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user.email.split('@')[0]} profile'

    class Meta:
        verbose_name = "User Profile"               # singular
        verbose_name_plural = "User Profiles"       # custom plural