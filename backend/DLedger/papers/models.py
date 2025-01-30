from django.db import models

class Paper(models.Model):
    title = models.CharField(max_length=200)
    ipfs_hash = models.CharField(max_length=100, null=True, blank=True)  # Remove unique constraint
    user_uid = models.CharField(max_length=100)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    temp_file = models.FileField(upload_to='temp/', null=True)
    city = models.CharField(max_length=200, help_text="Enter the city name.")
    coordinates = models.JSONField()
    land_size = models.DecimalField(max_digits=10, decimal_places=2, help_text="Enter the land size in acres/hectares/etc.")


    def __str__(self):
        return self.title
