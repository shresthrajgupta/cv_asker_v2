import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q, Exists, OuterRef
from django.utils import timezone
from datetime import timedelta

from ..models import Question, Skill, UserQuestionHistory

from ..utils import generate_question

# fmt: off
def get_askable_questions(user, skill_obj, proficiency, limit=10):
    now = timezone.now()
    one_month_ago = now - timedelta(days=30)

    # Subquery for history of this user+question
    history_qs = UserQuestionHistory.objects.filter(
        user=user,
        question=OuterRef("pk")
    )

    # --- Eligibility conditions ---
    # 1. No history exists (never answered)
    no_history = ~Exists(history_qs)

    # 2. History exists but:
    #    - answered_correctly = False
    #    - OR last_asked_at < one month ago
    eligible_history = Exists(history_qs.filter(Q(answered_correctly=False) | Q(last_asked_at__lt=one_month_ago)))

    qs = (
        Question.objects
        .filter(skill=skill_obj, difficulty=proficiency)
        .filter(Q(no_history) | Q(eligible_history))
        .order_by("?")[:limit]
    )

    return list(qs)


class GetQuestionsAPIView(APIView):
    def post(self, request):
        skill_name = request.data.get("skill")
        proficiency = request.data.get("proficiency")

        if not skill_name or proficiency is None:
            return Response(
                {"error": "Both 'skill' and 'proficiency' are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if(proficiency < 1 or proficiency > 10):
            return Response(
                {"error": "Invalid proficiency"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            skill_obj, created = Skill.objects.get_or_create(name=skill_name, proficiency=proficiency)
            user = request.user
        except Exception as e:
            if os.environ.get("DEBUG_MODE") == 'true':
                print("Error getting skills", e)
            return Response(
                {"error": "Internal server error, please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        eligible_questions = get_askable_questions(user, skill_obj, proficiency, limit=10)

        remaining = 10 - len(eligible_questions)
        if remaining > 0:
            try:
                print("calling LLM to generate remaining questions")
                ai_questions = generate_question(skill_name, proficiency)
            except Exception as e:
                if os.environ.get("DEBUG_MODE") == 'true':
                    print("AI question generating error", e)
                return Response(
                    {"error": "Error generating questions, please try again."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            for item in ai_questions:
                if len(item) != 6:
                    return Response({"error": "incorrect format of question array"})

                q_text, opt_a, opt_b, opt_c, opt_d, correct = item
                correct = correct.upper()

                obj = Question.objects.create(
                    skill=skill_obj,
                    question=q_text,
                    option_a=opt_a,
                    option_b=opt_b,
                    option_c=opt_c,
                    option_d=opt_d,
                    correct_ans=correct,
                    difficulty=proficiency,
                )

                if remaining > 0:
                    eligible_questions.append(obj)

                remaining -= 1

        data = [
            {
                "id": q.id,
                "question": q.question,
                "option_a": q.option_a,
                "option_b": q.option_b,
                "option_c": q.option_c,
                "option_d": q.option_d,
                "correct_ans": q.correct_ans,
                "difficulty": q.difficulty,
            }
            for q in eligible_questions
        ]

        return Response({"data": data}, status=status.HTTP_200_OK)
