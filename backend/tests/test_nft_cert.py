from brownie import nftCert, accounts
import pytest

@pytest.fixture
def nft_contract():
    account = accounts[0]
    return nftCert.deploy({"from": account})

def test_minting(nft_contract):
    account = accounts[0]
    token_uri = "https://example.com/nft/1"
    tx = nft_contract.mint(token_uri, {"from": account})
    # Extract token ID from transaction event
    token_id = tx.events["CollectibleMinted"]["tokenId"]
    assert nft_contract.ownerOf(token_id) == account, "Account 0 should own the minted token"
    assert nft_contract.tokenURI(token_id) == token_uri, "Token URI should be set correctly"

# Remove or modify the test_set_token_uri function if your contract doesn't have a setTokenURI method.

def test_certificate_signature(nft_contract):
    account = accounts[0]
    token_uri = "https://example.com/nft/3"
    tx = nft_contract.mint(token_uri, {"from": account})
    token_id = tx.events["CollectibleMinted"]["tokenId"]
    
    signature = b"signature".hex()
    nft_contract.setCertificateSignature(token_id, signature, {"from": account})

    returned_signature = nft_contract.getCertificateSignature(token_id).hex()
    
    assert returned_signature == signature, "Certificate signature should match"

