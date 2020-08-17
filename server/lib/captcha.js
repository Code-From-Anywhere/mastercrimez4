const Jimp = require("jimp");

const getImageBuffer = (image) =>
  new Promise((resolve) =>
    image.getBuffer("image/png", (err, buf) => resolve(buf))
  );

const getRandomInt = (low, high) =>
  Math.floor(Math.random() * (high - low) + low);

const backgroundCharsDefault = [..."0123456789"];
const backgroundColorDefault = 0xffffffff;

exports.getCaptcha = async (
  code,
  backgroundChars = backgroundCharsDefault,
  backgroundColor = backgroundColorDefault
) => {
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
  const image = await new Jimp(
    String(code).length * 30 + 30,
    50,
    backgroundColor
  );
  const cimage = await new Jimp(30, 30, 0xffffff00);
  const x = getRandomInt(20, 30);
  String(code)
    .split("")
    .map(async (cp, i) => {
      const chr = [...Array(1)].map(
        () => backgroundChars[(Math.random() * backgroundChars.length) | 0]
      )[0]; // eslint-disable-line no-bitwise
      cimage
        .crop(0, 0, 30, 30)
        .print(font, 0, 0, chr)
        .rotate(getRandomInt(1, getRandomInt(1, 60), true))
        .opacity(0.4)
        .print(font, 0, 0, cp)
        .resize(20, 20, Jimp.RESIZE_BEZIER)
        .rotate(getRandomInt(1, 15))
        .resize(getRandomInt(40, 42), getRandomInt(40, 42), Jimp.RESIZE_HERMITE)
        .opacity(0.8)
        .dither16();
      image.composite(
        cimage,
        x + i * 20 - getRandomInt(5, 10),
        getRandomInt(2, 8)
      );
    });
  image.autocrop();
  const buffer = await getImageBuffer(image);
  return buffer;
};
