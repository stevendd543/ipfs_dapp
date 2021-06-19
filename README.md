# ipfs_dapp
### create a new React application: 
`npx create-react-app react-dapp` 
### install hardhat and ether.js (in react-dapp directory)
`npm install ethers hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers` 
### create a hardhat sample
`npx hardhat`  
```
-react-dapp 
  -hardhat.config.js 整個hardhat設定
  -scripts 用來部屬合約
  -test 測試合約
  -contracts 合約撰寫
```
### complete contract and compile 
`npx hardhat compile` </br>
編譯後會產生一個資料夾artifacts用來儲存合約的abi</br>
</br>
所以只要在任一個程式中import就可以使用合約的abi</br>
`import Greeter from './artifacts/contracts/.sol/.json`
