import os
from django.conf import settings
from django.http import HttpResponse
from django.views.generic import View


class FrontendAppView(View):
    def get(self, request):
        if settings.DEBUG:
            return HttpResponse(
                "Frontend is served from React Dev Server (npm start).",
                status=200,
            )
        else:
            try:
                with open(os.path.join(settings.ROOT_DIR, "client/dist", "index.html")) as f:
                    return HttpResponse(f.read())
            except FileNotFoundError:
                return HttpResponse(
                    "Vite build not found. Did you run `npm run build`?",
                    status=501,
                )
