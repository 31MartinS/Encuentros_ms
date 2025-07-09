import QRCode from 'qrcode';

const generarQR = async (text) => {
  return await QRCode.toDataURL(text);
};

export default generarQR;
