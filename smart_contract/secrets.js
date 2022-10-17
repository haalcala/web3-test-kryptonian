module.exports.secrets = {
    networks: {
        goerli: {
            endpoint: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_APP_API_KEY}`,
            accountPrivateKey: process.env.ACCOUNT_PRIVATE_KEY,
            accountPublicKey: process.env.ACCOUNT_PUBLIC_KEY
        }
    }
}