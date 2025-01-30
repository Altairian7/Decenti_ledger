from django.contrib import admin
from django import forms
from .models import Paper
from .firebase_utils import fetch_firebase_users
from .utils import upload_paper_to_pinata

class PaperAdminForm(forms.ModelForm):
    class Meta:
        model = Paper
        fields = ['title', 'temp_file', 'user_uid', 'coordinates', 'land_size', 'city']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        try:
            firebase_users = fetch_firebase_users()
            self.fields['user_uid'] = forms.ChoiceField(
                choices=[(user['uid'], user['email']) for user in firebase_users] if firebase_users else []
            )
        except Exception as e:
            self.fields['user_uid'] = forms.ChoiceField(choices=[])
            print(f"Error fetching Firebase users: {e}")

        # Customize the widget for the coordinates field
        self.fields['coordinates'] = forms.JSONField(
            widget=forms.Textarea(attrs={'rows': 4, 'cols': 40}),
            help_text="Enter coordinates as a JSON array, e.g., [[lat1, lon1], [lat2, lon2], [lat3, lon3], [lat4, lon4]]"
        )
        self.fields['land_size'].help_text = "Enter the land size in acres."
        self.fields['city'].help_text = "Enter the city name."

    def clean_coordinates(self):
        coordinates = self.cleaned_data.get('coordinates')
        if not isinstance(coordinates, list) or len(coordinates) != 4:
            raise forms.ValidationError("Coordinates must be a list of exactly 4 pairs.")
        for coord in coordinates:
            if not (isinstance(coord, list) and len(coord) == 2):
                raise forms.ValidationError("Each coordinate must be a list with 2 values (latitude, longitude).")
        return coordinates

    def clean(self):
        cleaned_data = super().clean()

        # Validate temp_file and handle IPFS hash generation
        if 'temp_file' in cleaned_data:
            try:
                file = cleaned_data['temp_file']
                file_content = file.read()
                ipfs_hash = upload_paper_to_pinata(file_content)
                
                # Check for existing hash
                if Paper.objects.filter(ipfs_hash=ipfs_hash).exists():
                    raise forms.ValidationError("This file has already been uploaded")
                
                self.instance.ipfs_hash = ipfs_hash
                file.seek(0)
            except Exception as e:
                raise forms.ValidationError(f"Upload failed: {str(e)}")
        
        # Validate land size (optional, if you want extra checks)
        land_size = cleaned_data.get('land_size')
        if land_size and land_size <= 0:
            raise forms.ValidationError("Land size must be a positive value.")
        
        return cleaned_data

class PaperAdmin(admin.ModelAdmin):
    form = PaperAdminForm
    list_display = ('title', 'ipfs_hash', 'user_uid', 'land_size', 'uploaded_at')
    readonly_fields = ('ipfs_hash',)

admin.site.register(Paper, PaperAdmin)
