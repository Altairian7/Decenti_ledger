import firebase_admin
from firebase_admin import credentials, auth

# Initialize Firebase
cred = credentials.Certificate(r"E:\DLedger\backend\DLedger\papers\serviceAccountKey.json")
firebase_admin.initialize_app(cred)

def fetch_firebase_users():
    """Fetch users from Firebase Authentication"""
    users = []
    try:
        # Fetch all users from Firebase Auth
        page = auth.list_users()
        while page:
            for user in page.users:
                users.append({'uid': user.uid, 'email': user.email})
            page = page.get_next_page()
    except Exception as e:
        print(f"Error fetching Firebase users: {str(e)}")
    return users