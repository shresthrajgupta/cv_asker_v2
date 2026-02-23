from rest_framework import serializers

from ..models import Skill, UserProfile


class SkillInputSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=50)
    proficiency = serializers.IntegerField(min_value=0, max_value=10)

# fmt: off
class UserProfileCreateSerializer(serializers.ModelSerializer):
    skills = SkillInputSerializer(many=True)

    class Meta:
        model = UserProfile
        fields = ["job_profile", "experience_years", "skills"]

    def validate_skills(self, value):
        if not value or len(value) < 1:
            raise serializers.ValidationError("At least one skill is required.")
        return value

    def create(self, validated_data):
        skills_data = validated_data.pop("skills")
        user = self.context["request"].user

        existing_profile = UserProfile.objects.filter(user=user).first()
        if existing_profile:
            existing_profile.delete()

        profile = UserProfile.objects.create(user=user, **validated_data)

        for s in skills_data:
            skill_obj, _ = Skill.objects.get_or_create(name=s["name"], proficiency=s["proficiency"], defaults={"proficiency": s["proficiency"]})
            if skill_obj.proficiency != s["proficiency"]:
                skill_obj.proficiency = s["proficiency"]
                skill_obj.save()
            profile.skills.add(skill_obj)

        return profile

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    skills = SkillInputSerializer(many=True, required=False)

    class Meta:
        model = UserProfile
        fields = ["job_profile", "experience_years", "skills"]

    def update(self, instance, validated_data):
        skills_data = validated_data.pop("skills", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if skills_data is not None:
            instance.skills.clear()   # clear existing skills

            for s in skills_data:
                skill_obj, created = Skill.objects.get_or_create(
                    name=s["name"],
                    proficiency=s["proficiency"],
                )
                instance.skills.add(skill_obj)

        return instance

class UserProfileGetSerializer(serializers.ModelSerializer):
    skills = SkillInputSerializer(many=True, read_only=True)

    class Meta:
        model = UserProfile
        fields = ["skills", "job_profile", "experience_years"]