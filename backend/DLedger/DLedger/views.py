from Ledger.utils import register_on_blockchain
from http import JsonResponse

def upload_paper(request):
    # Assuming you have user address and IPFS hash from the frontend
    wallet_address = request.user.wallet_address  # Get the address from the user's profile
    ipfs_hash = request.data['ipfs_hash']  # IPFS hash of the uploaded paper
    
    # Call the function to interact with the blockchain
    tx_hash = register_on_blockchain(wallet_address, ipfs_hash)
    
    # Send the transaction hash back as a response
    return JsonResponse({"tx_hash": tx_hash.hex()})
