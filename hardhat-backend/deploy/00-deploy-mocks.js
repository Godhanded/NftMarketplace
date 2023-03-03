const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAcoounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    
    const args=[]
    log("--------------------")
    const mockNft = await deploy("MockNft", {
        from: deployer,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
                log("verifying.....")
                await verify(mockNft.address, args)
            }
    log("-------------------")
}
module.exports.tags = ["all", "mocknft", "mocks"]
