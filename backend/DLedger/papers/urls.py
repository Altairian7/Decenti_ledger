from django.urls import path
from .views import PaperUploadView, PaperListView, test_endpoint

urlpatterns = [
    path('upload/', PaperUploadView.as_view(), name='upload-paper'),
    path('papers/', PaperListView.as_view(), name='paper-list'),
    path('test/', test_endpoint, name='test-endpoint'),

]

