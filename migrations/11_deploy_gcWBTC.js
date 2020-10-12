const G = artifacts.require('G');
const GLiquidityPoolManager = artifacts.require('GLiquidityPoolManager');
const GCDelegatedReserveManager = artifacts.require('GCDelegatedReserveManager');
const gcDAI = artifacts.require('gcDAI');
const gcWBTC = artifacts.require('gcWBTC');
const GSushiswapExchange = artifacts.require('GSushiswapExchange');
const GUniswapV2Exchange = artifacts.require('GUniswapV2Exchange');

module.exports = async (deployer, network) => {
  deployer.link(G, gcWBTC);
  deployer.link(GLiquidityPoolManager, gcWBTC);
  deployer.link(GCDelegatedReserveManager, gcWBTC);
  const gctoken = await gcDAI.deployed();
  await deployer.deploy(gcWBTC, gctoken.address);
  let exchange
  if (['mainnet', 'development', 'testing'].includes(network)) {
    exchange = await GSushiswapExchange.deployed();
  } else {
    exchange = await GUniswapV2Exchange.deployed();
  }
  const token = await gcWBTC.deployed();
  await token.setExchange(exchange.address);
  await token.setMiningGulpRange('20000000000000000000', '500000000000000000000');
  await token.setGrowthGulpRange('10000000000000000000000', '20000000000000000000000');
};
