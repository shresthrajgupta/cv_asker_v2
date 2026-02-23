from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from ..models import Skill, UserProfile

# fmt: off
class UpdateSkillProficiencyAPIView(APIView):
    def patch(self, request):
        skill_name = request.data.get("skill")
        action = request.data.get("action")

        if not skill_name or action not in ["increase", "decrease"]:
            return Response({"detail": "Both 'skill' and valid 'action' (increase/decrease) are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response({"detail": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        current_skill = profile.skills.filter(name__iexact=skill_name).first()

        if not current_skill:
            return Response({"detail": f"Skill '{skill_name}' not found in profile."}, status=status.HTTP_404_NOT_FOUND)

        if action == "increase":
            new_skill, _ = Skill.objects.get_or_create(name=current_skill.name, proficiency=current_skill.proficiency + 1)

            profile.skills.remove(current_skill)
            profile.skills.add(new_skill)

        if action == "decrease":
            new_skill, _ = Skill.objects.get_or_create(name=current_skill.name, proficiency=current_skill.proficiency - 1)

            profile.skills.remove(current_skill)
            profile.skills.add(new_skill)

        return Response(
            {
                "data": {"message": f"{action.title()}d proficiency for {skill_name}"}
            },
            status=status.HTTP_200_OK,
        )
