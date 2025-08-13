// Simple image optimization script using sharp
// Generates multiple responsive sizes + webp versions
// Usage: npx node scripts/optimize-images.js

import { readdirSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

const SRC_DIR = path.resolve('assets');
const OUT_DIR = path.resolve('assets/optimized');
// Reduced sizes for even smaller payload
// Tiny placeholder width
// Configuration ------------------------------
const baseSizes = [240, 420, 720];             // default sizes
const homeSmallSizes = [100, 180, 320];         // even smaller (halb so groß) for startseite
const homeSmallFlag = process.argv.includes('--home-small');
// Placeholder & quality
const placeholderWidth = 24;
let jpegQuality = homeSmallFlag ? 62 : 60;
let webpQuality = homeSmallFlag ? 55 : 50;
let avifQuality = homeSmallFlag ? 42 : 40;
const sharpenConfig = homeSmallFlag ? [1.3, 1, 2.2] : [1.1, 1, 2];
// Crop bottom percentage to remove embedded text bars / captions
const cropBottomPercent = process.argv.includes('--crop') ? 0.18 : 0; // 18% crop if --crop passed
// Supported naming: new semantic names OR legacy "bild X" fallback
const likedUuid = '41819f8e-51e3-4c75-915e-e11dbbeeb64f.jpg';
const filePattern = /(hero|mission|values|features|vision|partner).+\.(jpg|jpeg|png)$|bild [1-8]\.jpg/i;
let targetsAll = readdirSync(SRC_DIR).filter(f => filePattern.test(f));
// Ensure liked UUID image is included if present
if(readdirSync(SRC_DIR).includes(likedUuid) && !targetsAll.includes(likedUuid)){
  targetsAll.push(likedUuid);
}
let targets = targetsAll;
if(homeSmallFlag){
  // limit to first 4 images for faster iteration
  targets = targetsAll.filter(f => /^bild\s*[1-4]\.jpg$/i.test(f));
}

if(!existsSync(OUT_DIR)) mkdirSync(OUT_DIR);

(async () => {
  for(const file of targets){
    const baseName = file.replace(/\.(jpg|jpeg|png)$/i,'');
    const inputPath = path.join(SRC_DIR,file);
    let meta;
    try { meta = await sharp(inputPath).metadata(); } catch(e){ console.warn('Skip (metadata):', file, e.message); continue; }
    let pipelineBase;
    if(cropBottomPercent > 0 && meta.height){
      const cropHeight = Math.max(10, Math.round(meta.height * (1 - cropBottomPercent)));
      pipelineBase = sharp(inputPath).extract({ left:0, top:0, width: meta.width, height: cropHeight });
    } else {
      pipelineBase = sharp(inputPath);
    }

    // Placeholder from cropped base
    const placeholderOut = path.join(OUT_DIR, `${baseName}-placeholder.jpg`);
    await pipelineBase
      .clone()
      .resize({ width: placeholderWidth })
      .jpeg({ quality: 28, mozjpeg: true })
      .blur(6)
      .toFile(placeholderOut);

    // Determine sizes list per image
    let sizesList;
    if(baseName === likedUuid.replace(/\.(jpg|jpeg|png)$/i,'')){
      // special hero sizes for liked photo
      sizesList = [640, 960, 1280];
    } else if(/^bild\s*[1-4]$/i.test(baseName)){
      // Merge and dedupe if not only small
      sizesList = homeSmallFlag ? homeSmallSizes : [...new Set([...homeSmallSizes, ...baseSizes])].sort((a,b)=>a-b);
    } else {
      sizesList = baseSizes;
    }
    for(const w of sizesList){
      const jpgOut = path.join(OUT_DIR, `${baseName}-${w}.jpg`);
      const webpOut = path.join(OUT_DIR, `${baseName}-${w}.webp`);
      const avifOut = path.join(OUT_DIR, `${baseName}-${w}.avif`);
      await pipelineBase
        .clone()
        .resize({ width: w })
        .jpeg({ quality: jpegQuality, mozjpeg: true })
        .sharpen(...sharpenConfig)
        .toFile(jpgOut);
      await pipelineBase
        .clone()
        .resize({ width: w })
        .webp({ quality: webpQuality })
        .sharpen(...sharpenConfig)
        .toFile(webpOut);
      await pipelineBase
        .clone()
        .resize({ width: w })
        .avif({ quality: avifQuality })
        .sharpen(...sharpenConfig)
        .toFile(avifOut);
      console.log('Generated', path.basename(jpgOut), path.basename(webpOut), path.basename(avifOut));
    }
  }
  // Create placeholders.json mapping baseName -> base64 data URI
  const placeholderMap = {};
  for(const file of readdirSync(OUT_DIR).filter(f=>/placeholder\.jpg$/i.test(f))){
    const b64 = readFileSync(path.join(OUT_DIR,file)).toString('base64');
    const key = file.replace(/-placeholder\.jpg$/,'');
    placeholderMap[key] = `data:image/jpeg;base64,${b64}`;
  }
  writeFileSync(path.join(OUT_DIR,'placeholders.json'), JSON.stringify(placeholderMap,null,2));
  console.log('Wrote placeholders.json with', Object.keys(placeholderMap).length, 'entries');
  console.log('Done.');
})();
