from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view
from .models import Paper

from .serializers import PaperSerializer
from .utils import upload_paper_to_pinata
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import ListAPIView

class PaperUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')  # Get the file from the request

        if file:
            # Upload the file to IPFS
            ipfs_hash = upload_paper_to_pinata(file)

            # Store the paper info in the database
            paper = Paper.objects.create(
                ipfs_hash=ipfs_hash, 
                location=request.data.get('location'), 
                username=request.user.username
            )
            
            serializer = PaperSerializer(paper)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

class PaperListView(ListAPIView):
    """
    API endpoint to retrieve papers filtered by user_uid.
    """
    serializer_class = PaperSerializer

    def get_queryset(self):
        user_uid = self.request.query_params.get('user_uid')  # Get user_uid from query params
        permission_classes = [IsAuthenticated]
        if user_uid:
            return Paper.objects.filter(user_uid=user_uid)  # Filter by user_uid
        return Paper.objects.all()  # Return all if no user_uid is provided

@api_view(['GET'])
def test_endpoint(request):
    return Response({"message": "is it ?"})