from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from .user_profile_model import Skill


# fmt: off
class Question(models.Model):
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='questions')

    question = models.TextField(blank=False)
    option_a = models.TextField(blank=False)
    option_b = models.TextField(blank=False)
    option_c = models.TextField(blank=False)
    option_d = models.TextField(blank=False)

    CORRECT_CHOICES = [
        ('A', 'Option A'),
        ('B', 'Option B'),
        ('C', 'Option C'),
        ('D', 'Option D'),
    ]
    correct_ans = models.CharField(max_length=1, choices=CORRECT_CHOICES, blank=False)

    difficulty = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)], blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Question ID - {self.id}'

    class Meta:
        verbose_name = "Question"               # singular
        verbose_name_plural = "Questions"       # custom plural
