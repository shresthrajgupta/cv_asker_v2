import json
from rest_framework import serializers

# fmt: off
class PDFUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    custom_fields = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    def validate_file(self, value):
        max_size = 5  # Megabytes

        if not value.name.lower().endswith('.pdf'):
            raise serializers.ValidationError('Only PDF files are allowed.')
        if value.size > max_size * 1024 * 1024:
            raise serializers.ValidationError(f'File too large. Max size is {max_size} MB.')
        return value

    def validate_custom_fields(self, value):
        if not value or value.strip() == '':
            return []

        try:
            data = json.loads(value)
            if not isinstance(data, list):
                raise serializers.ValidationError('Wrong formatting for private info key value pairs')
            return data
        except json.JSONDecodeError:
            raise serializers.ValidationError('Wrong formatting for private info key value pairs')
