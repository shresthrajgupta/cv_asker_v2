from django.contrib.auth.tokens import default_token_generator
from templated_mail.mail import BaseEmailMessage

from djoser import utils
# from djoser.conf import
from django.conf import settings


class ActivationEmail(BaseEmailMessage):
    template_name = "cv_asker/activation.html"

    def get_context_data(self):
        context = super().get_context_data()
        user = context.get("user")
        context["uid"] = utils.encode_uid(user.pk)
        context["token"] = default_token_generator.make_token(user)
        path = settings.DJOSER["ACTIVATION_URL"].format(**context)
        context["url"] = f"{settings.FRONTEND_URL}{path}"
        return context


class ConfirmationEmail(BaseEmailMessage):
    template_name = "cv_asker/confirmation.html"


class PasswordResetEmail(BaseEmailMessage):
    template_name = "cv_asker/password_reset.html"

    def get_context_data(self):
        context = super().get_context_data()
        user = context.get("user")
        context["uid"] = utils.encode_uid(user.pk)
        context["token"] = default_token_generator.make_token(user)
        path = settings.DJOSER["PASSWORD_RESET_CONFIRM_URL"].format(**context)
        context["url"] = f"{settings.FRONTEND_URL}{path}"
        return context


class PasswordChangedConfirmationEmail(BaseEmailMessage):
    template_name = "cv_asker/password_confirmation.html"
