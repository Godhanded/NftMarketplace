import { useEffect, useState } from "react"
import {
    useContractRead,
    useAccount,
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction,
} from "wagmi"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftMarketAddress from "../constants/contractAddresses.json"
import nftAbi from "../constants/MockNft.json"
import { useNotification } from "@web3uikit/core"
import Card from "./Card"
import UpdateListingModal from "./UpdateListingModal"
import Image from "next/image"
import { ethers } from "ethers"

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const seperator = "..."
    const charsToShow = strLen - seperator.length
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) + seperator + fullStr.substring(fullStr.length - backChars)
    )
}

export default function NFTBox({ price, nftAddress, seller, tokenId }) {
    const [imageURI, setImageURI] = useState("")
    const [tokenData, setTokenData] = useState({ name: "", description: "" })
    const [showModal, setShowModal] = useState(false)
    const dispatch = useNotification()
    const getUri = useContractRead({
        abi: nftAbi,
        address: nftAddress,
        functionName: "tokenURI",
        args: [tokenId],
        enabled: Boolean(tokenId),
    })

    const { write, data } = useContractWrite({
        mode: "recklesslyUnprepared",
        address: nftMarketAddress[5]["NftMarketplace"][0],
        abi: nftMarketplaceAbi,
        functionName: "buyItem",
        args: [nftAddress, tokenId],
        overrides: {
            value: ethers.utils.parseEther(`${price}`),
        },
        onSuccess(tx) {
            dispatch({
                type: "info",
                message: "Tx Confirming",
                title: "Please Wait for Tx to Confirm",
                position: "topR",
            })
        },
        onError(data){
            dispatch({
                type: "error",
                message: data.message.substring(0,100),
                title: data.name,
                position: "topR",
            })
        }
    })
    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    })
    const handleBuySuccess = () => {
        dispatch({
            type: "success",
            message: "Item Bought",
            title: "item bought",
            position: "topR",
        })
    }

    isSuccess && handleBuySuccess()

    const { isConnected, address } = useAccount()
 
    async function updateUI() {
        const tokenURI = getUri?.data
        if (tokenURI) {
            // ipfs gate way ipfs not supported browser
            const requestUrl = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenUriResopnse = await (await fetch(requestUrl)).json()
            const imageUri = tokenUriResopnse.image
            const newImageUrl = imageUri.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(newImageUrl)
            setTokenData({ name: tokenUriResopnse.name, description: tokenUriResopnse.description })
        }
    }
  
    useEffect(() => {
        updateUI()
    }, [isConnected])

    const isOwnedByUser = seller == address.toLocaleLowerCase() || seller == undefined
    const fromatedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15)

    const handleCardClick = (event) => {
        isOwnedByUser ? setShowModal(true) : write?.()
    }

    return (
        <div>
            {imageURI ? (
                <div>
                    <UpdateListingModal
                        isVisible={showModal}
                        nftAddress={nftAddress}
                        tokenId={tokenId}
                        onClose={() => setShowModal(false)}
                    />
                    <Card
                        tokenId={tokenId}
                        title={tokenData.name}
                        description={tokenData.description}
                        price={`${ethers.utils.formatUnits(`${price}`, "ether")} ETH`}
                        onClick={handleCardClick}
                    >
                        <div className="italic text-sm">Owned by {fromatedSellerAddress}</div>
                        <Image
                            className="mx-auto"
                            loader={() => imageURI}
                            src={imageURI}
                            alt={tokenData.name}
                            height="200"
                            width="200"
                        />
                    </Card>
                </div>
            ) : (
                <div>loading...</div>
            )}
        </div>
    )
}
