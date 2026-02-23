from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone

from ..models import Question, UserQuestionHistory


class AnswerQuestionAPIView(APIView):
    def post(self, request):
        question_id = request.data.get("question_id")
        answered_correctly = request.data.get("answered_correctly")

        if question_id is None or answered_correctly is None:
            return Response(
                {"detail": "'question_id' and 'answered_correctly' are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        question = get_object_or_404(Question, pk=question_id)
        user = request.user

        history, created = UserQuestionHistory.objects.update_or_create(
            user=user,
            question=question,
            defaults={
                "answered_correctly": answered_correctly,
                "last_asked_at": timezone.now(),
            },
        )

        return Response(
            {
                "data": {
                    "message": "History updated" if not created else "History created",
                }
            },
            status=status.HTTP_200_OK,
        )
