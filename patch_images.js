import fs from 'fs/promises';

async function run() {
  let content = await fs.readFile('src/data/carsCatalog.ts', 'utf8');

  const newImagesAuto = `
        images: [
  "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613217/oy4rgutdpjynh4yjqqkj.png",
  "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613218/vftlrhgorttpmbgsehf7.png",
  "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613219/ovchltjlj6gk7iltv5ed.png",
  "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613221/xhxi5xna5ngkxt8gxqbr.png",
  "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613222/lnfthxcq55tcmoyunxzy.png",
  "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613224/q29a79aummggajwrgbes.png",
  "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613225/q3uweydwpwtnxguqjlpv.png",
  "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613226/cnmp41g7atvftjihq6no.png",
  "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613227/e6jkwun0hwasbqkpzah7.png",
  "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613229/adaawg3dlhdm8oguamly.png",
  "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613230/nghimiyl9cpuagy8ky9u.png",
  "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613231/e9xpx46p2j0ubzxlhmbb.png",
  "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613233/aqbfew6efghoxjqzkepx.png",
  "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613234/xledom3dkkrsitm3iqhr.png",
  "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613236/rmo2set5dmtrno3gtqty.png",
  "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613238/wpbcow2gjptmfxfyd2u0.png",
  "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613240/tgjymcqjpkwqfcm2ucbn.png",
  "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613242/kswaakgbywhg9y1ky5bt.png",
  "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613244/hrapm3hmuyz4j2pg6wnb.png",
  "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613246/x6p01lovnfsuv3llb1gy.png",
  "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613248/xz1um0xc14i2ystvtw3v.png"
        ],`;

  const mg5Index = content.indexOf("'mg-5': {");
  if (mg5Index === -1) {
    console.log("mg-5 not found");
    process.exit(1);
  }

  const autoIndex = content.indexOf("id: 'automatic'", mg5Index);
  const autoImagesStart = content.indexOf("images: [", autoIndex);
  const autoImagesEnd = content.indexOf("],", autoImagesStart) + 2;

  content = content.slice(0, autoImagesStart) + newImagesAuto.trim() + "," + content.slice(autoImagesEnd);

  await fs.writeFile('src/data/carsCatalog.ts', content, 'utf8');
  console.log("Successfully patched src/data/carsCatalog.ts images");
}
run().catch(console.error);
