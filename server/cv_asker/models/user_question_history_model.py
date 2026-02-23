from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model

from .question_model import Question

User = get_user_model()

# fmt: off
class UserQuestionHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='question_history')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='user_histories')
    answered_correctly = models.BooleanField()
    last_asked_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'question')
        indexes = [models.Index(fields=["user", "last_asked_at"])]

    def __str__(self):
        return f'History: {self.user.email.split('@')[0]}, Ques ID {self.question.id}'

    class Meta:
        verbose_name = "Question History"               # singular
        verbose_name_plural = "Question Histories"      # custom plural