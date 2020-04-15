const serverAddr = "https://mcz.leckrapi.xyz";
const localAddr = "http://192.168.178.221:4001";
const devLocal = true;

const Constants = {
  SERVER_ADDR: __DEV__ && devLocal ? localAddr : serverAddr,
  VERSION: "4.0.6",
  CAPTCHA: "6Lcc6egUAAAAABDsc8m8s3m-sxfWAdPR5iV13-Tf",
};

export default Constants;
