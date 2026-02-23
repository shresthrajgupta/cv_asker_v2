from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from ..serializers import PDFUploadSerializer

from ..utils import pdf_parser


class PDFUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        try:
            serializer = PDFUploadSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            pdf_file = serializer.validated_data['file']
            custom_fields = serializer.validated_data.get('custom_fields')
            pdf_bytes = pdf_file.read()

            data = pdf_parser(pdf_bytes, custom_fields=custom_fields)

            return Response({'data': data}, status=status.HTTP_200_OK)
        except Exception as exc:
            return Response(
                (exc.detail if hasattr(exc, "detail") else {'error': exc}),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
