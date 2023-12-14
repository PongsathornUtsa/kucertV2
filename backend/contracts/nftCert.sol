// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract nftCert is ERC721URIStorage, AccessControl {
    uint256 public tokenCounter;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant UNIVERSITY_ROLE = keccak256("UNIVERSITY_ROLE");

    mapping(uint256 => bytes) public certificateSignatures;

    event CollectibleMinted(uint256 indexed tokenId, address indexed owner, string tokenURI);
    event CertificateSignatureSet(uint256 indexed tokenId, bytes signature);

    constructor() ERC721("KuCert", "KCRT") {
        tokenCounter = 1;
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(UNIVERSITY_ROLE, msg.sender);
        _setRoleAdmin(UNIVERSITY_ROLE, ADMIN_ROLE);
    }

    function mint(string memory _tokenURI) public onlyRole(UNIVERSITY_ROLE) returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        tokenCounter += 1;

        emit CollectibleMinted(newTokenId, msg.sender, _tokenURI);
        return newTokenId;
    }

    function grantRole(bytes32 role, address account) public override onlyRole(getRoleAdmin(role)) {
        _grantRole(role, account);
    }

    function revokeRole(bytes32 role, address account) public override onlyRole(getRoleAdmin(role)) {
        _revokeRole(role, account);
    }

    function universitySafeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public onlyRole(UNIVERSITY_ROLE) {
        require(_msgSender() == ownerOf(tokenId) || getApproved(tokenId) == _msgSender() || isApprovedForAll(ownerOf(tokenId), _msgSender()), "ERC721: transfer caller is not owner nor approved");
        _safeTransfer(from, to, tokenId, "");
    }

    function setCertificateSignature(uint256 tokenId, bytes memory signature) public onlyRole(UNIVERSITY_ROLE) {
        require(ownerOf(tokenId) != address(0), "ERC721: nonexistent token"); 
        certificateSignatures[tokenId] = signature;
        emit CertificateSignatureSet(tokenId, signature);
    }

    function getCertificateSignature(uint256 tokenId) public view returns (bytes memory) {
        require(ownerOf(tokenId) != address(0), "ERC721: nonexistent token");
        require(_msgSender() == ownerOf(tokenId) || getApproved(tokenId) == _msgSender() || isApprovedForAll(ownerOf(tokenId), _msgSender()), "Caller is not the owner, approved, nor university");
        return certificateSignatures[tokenId];
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

}
