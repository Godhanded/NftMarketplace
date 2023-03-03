import { Modal, Input, useNotification } from "@web3uikit/core"
import { CheckSquare, Cloud } from "@web3uikit/icons"
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi"
import { useEffect, useState } from "react"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftMarketAddress from "../constants/contractAddresses.json"
import { ethers } from "ethers"

export default function UpdateListingModal({ nftAddress, tokenId, isVisible, onClose }) {
    const [priceToUpdateListing, setPriceToUpdateListing] = useState(0)

    const {
        error: prepareError,
        config,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: nftMarketAddress[5]["NftMarketplace"][0],
        abi: nftMarketplaceAbi,
        functionName: "updateListing",
        args: [nftAddress, tokenId, ethers.utils.parseEther(`${priceToUpdateListing}` || "0")],
    })

    const { write, data, error, isError } = useContractWrite({
        ...config,
        onSuccess(tx) {
            dispatch({
                type: "info",
                message: "Please Wait for Tx to Confirm,You will be notified",
                title: "Tx Confirming",
                position: "topR",
            })
        },
    })
    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    })
    const dispatch = useNotification()
    const handleUpdateSuccessful = () => {
        dispatch({
            type: "success",
            message: "listing Updated",
            title: "Listing Updated - Please refresh",
            position: "topR",
            icon: CheckSquare,
            
        })
        onClose && onClose()
        setPriceToUpdateListing("0")
    }
    useEffect(()=>{
        if (isSuccess) handleUpdateSuccessful()
        
    },[isSuccess])
    
    return (
        <Modal
            isVisible={isVisible}
            onOk={() => write?.()}
            isOkDisabled={!write || isLoading}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
        >
            <Input
                label="update listing price in Li Currency (Eth)"
                name="New listing price"
                type="number"
                onChange={(event) => {
                    setPriceToUpdateListing(event.target.value)
                }}
            />
            
            {(isPrepareError || isError) && (
                <span className="italic text-red-400">
                    Error {(error || prepareError)?.message}
                </span>
            )}
        </Modal>
    )
}
