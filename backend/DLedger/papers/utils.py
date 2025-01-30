import os
import requests
import tempfile
from django.conf import settings

# Pinata API endpoint for file upload
PINATA_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS'

# Function to upload a file to Pinata and return its IPFS hash
def upload_paper_to_pinata(file_content):
    headers = {
        'pinata_api_key': settings.PINATA_API_KEY,
        'pinata_secret_api_key': settings.PINATA_API_SECRET
    }
    
    try:
        # Create temporary file and immediately close it
        temp_file = tempfile.NamedTemporaryFile(delete=False)
        temp_file.write(file_content)
        temp_file.close()
        
        # Open and upload file
        with open(temp_file.name, 'rb') as file_data:
            files = {
                'file': ('paper.pdf', file_data)
            }
            response = requests.post(PINATA_URL, files=files, headers=headers)
            
        # Clean up temp file after upload
        os.unlink(temp_file.name)
        
        if response.status_code != 200:
            raise Exception(f"Pinata API error: {response.text}")
            
        return response.json()['IpfsHash']
        
    except Exception as e:
        # Ensure temp file is cleaned up even if upload fails
        if 'temp_file' in locals():
            try:
                os.unlink(temp_file.name)
            except:
                pass
        raise e
