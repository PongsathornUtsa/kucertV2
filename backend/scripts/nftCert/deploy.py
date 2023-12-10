from scripts.nftCert.helpful_scripts import get_account, OPENSEA_URL
from brownie import nftCert, network, config, web3
import yaml, json
import os

def get_abi(contract):
    contract_data = contract._build
    return contract_data["abi"]

def save_abi_to_file(contract, file_path):
    abi = get_abi(contract)
    dir_name = os.path.dirname(file_path)
    if dir_name:
        os.makedirs(dir_name, exist_ok=True)
    with open(file_path, 'w') as outfile:
        json.dump(abi, outfile, indent=2)


def deploy():
    account = get_account()
    # Simulate deployment to estimate gas (if needed)
    # deploy_gas_estimate = nftCert.deploy.estimate_gas({"from": account})
    print("Account balance:", float(account.balance()) / 1e18, "ether")
    nft = nftCert.deploy(
        {"from": account, "gas_limit": 5000000}, publish_source=config["networks"][network.show_active()].get("verify", False)
    )
    print(f'Your contract deployed at {nft.address}')
    save_abi_to_file(nft, "abiFile.json")
    return nft

def main():
    deploy()

if __name__ == "__main__":
    main()
