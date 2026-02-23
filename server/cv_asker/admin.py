from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Question, Skill, UserAccount, UserProfile, UserQuestionHistory

# fmt: off
class CustomUserAdmin(UserAdmin):
    model = UserAccount
    list_display = ("name", "email", "is_active", "is_staff", "last_login", "created_at", "updated_at")
    list_filter = ("is_active", "is_staff", "created_at", "updated_at")
    ordering = ("email",)

    fieldsets = (
        (None, {"fields": ("email", "password", "name")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "is_superuser", "groups", "user_permissions")}),
        ("Timestamps", {"fields": ("last_login", "created_at", "updated_at")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "password1", "password2"),
        }),
    )

    readonly_fields = ("email", "last_login", "created_at", "updated_at")


# Register your models here.
admin.site.register(UserAccount, CustomUserAdmin)
admin.site.register(UserProfile)
admin.site.register(Skill)
admin.site.register(Question)
admin.site.register(UserQuestionHistory)
