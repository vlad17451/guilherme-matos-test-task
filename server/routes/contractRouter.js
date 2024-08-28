const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");

const RPC = 'https://optimism.drpc.org'

const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
]

router
  .route("/contract/check/:address")
  .get(
    async (req, res) => {
      const address = req.params.address;

      const isContract = await new ethers.providers.JsonRpcProvider(RPC).getCode(address).then(code => code !== '0x');

      if (!isContract) {
        res.send({
          address,
          isContract
        });
        return;
      }

      const contract = new ethers.Contract(address, ERC20_ABI, new ethers.providers.JsonRpcProvider(RPC));

      const name = await contract.name().catch(() => null);
      const symbol = await contract.symbol().catch(() => null);

      res.send({
        address,
        isContract,
        name,
        symbol,
      });
    }
  );

module.exports = router;