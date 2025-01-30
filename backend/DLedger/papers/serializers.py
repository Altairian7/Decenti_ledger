from rest_framework import serializers
from .models import Paper

class PaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paper
        fields = ['title', 'ipfs_hash', 'user_uid', 'uploaded_at', 'land_size', 'coordinates', 'city']
