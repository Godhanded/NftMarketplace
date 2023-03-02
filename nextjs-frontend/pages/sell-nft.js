import { Form } from "@web3uikit/core"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftMarketAddress from "../constants/contractAddresses.json"
import nftAbi from "../constants/MockNft.json"
import { ethers } from "ethers"

export default function Home() {
async function approveAndList(data){
    const nftAddress=data.data[0].inputResult
    const tokenId=data.data[1].inputResult
    const price = ethers.utils.parseEther(`${data.data[2].inputResult}`).toString() 

    const approveOptions={
        abi:nftAbi,
        address:nftAddress,
        functionName:"approve",
        args:[nftMarketAddress[5]["NftMarketplace"][0],tokenId],
        enabled:Boolean(tokenId)
    }
}

    return (
        <div>
            
            <Form 
            onSubmit={approveAndList}
            data={[
                {
                    name:"Nft Address",
                    type:"text",
                    inputWidth:"50%",
                    value:"",
                    key:"nftAddress"
                },
                {
                    name:"Token ID",
                    type:"number",
                    value:"",
                    key:"tokenId",
                },
                {
                    name:"Price in ETH",
                    type:"number",
                    value:"",
                    key:"price"
                }
            ]}
            title="Sell your NFT"
            id="Main Form"
            />
                
           
        </div>
    )
}
