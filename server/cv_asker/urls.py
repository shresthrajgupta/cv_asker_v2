from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

from .views import CustomTokenObtainPairView
from .views import PDFUploadView
from .views import UserProfileCreateView
from .views import GenerateQuestionsView
from .views import UpdateSkillProficiencyAPIView
from .views import AnswerQuestionAPIView
from .views import GetQuestionsAPIView
from .views import CookieTokenRefreshView
from .views import CustomTokenDeleteView
from .views import DownloadDatabaseView

# fmt: off
urlpatterns = [
    path("auth/jwt/create/", CustomTokenObtainPairView.as_view()),
    path("auth/jwt/refresh/", CookieTokenRefreshView.as_view()),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('upload/', PDFUploadView.as_view()),
    path("profile/", UserProfileCreateView.as_view()),
    path("profile/proficiency", UpdateSkillProficiencyAPIView.as_view()),
    path("question/store/", GenerateQuestionsView.as_view()),
    path("history/update", AnswerQuestionAPIView.as_view()),
    path("question/fetch", GetQuestionsAPIView.as_view()),
    path("logout/", CustomTokenDeleteView.as_view()),
    path("admin/download_db/", DownloadDatabaseView.as_view()),
]
