from brownie import accounts, network, config, Contract
from web3 import Web3

LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["ganache-local", "development", "ganache", "mainnet-fork"]
OPENSEA_URL = "https://testnets.opensea.io/assets/{}/{}"

def get_account(index=None, id=None):
    if index:
        return accounts[index]
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        return accounts[0]
    if id:
        return accounts.load(id)
    return accounts.add(config["wallets"]["from_key"])