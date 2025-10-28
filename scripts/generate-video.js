#!/usr/bin/env node
// Video generation script for VCan promotional content
// Generates a short promotional video using existing images and branding
// Usage: node scripts/generate-video.js

import { existsSync, mkdirSync, readFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const ASSETS_DIR = path.resolve('assets');
const OUT_DIR = path.resolve('assets/videos');
const TEMP_DIR = path.resolve('/tmp/vcan-video-gen');

// Video configuration
const VIDEO_CONFIG = {
  duration: 15, // seconds
  fps: 30,
  width: 1920,
  height: 1080,
  videoBitrate: '2M',
  audioBitrate: '128k',
};

// Text overlays configuration
const TEXT_OVERLAYS = [
  {
    text: 'VCan',
    subtitle: 'Menschlichkeit vernetzt',
    startTime: 0,
    duration: 3,
  },
  {
    text: 'Sicher. Unterstützend.',
    subtitle: 'Barrierefrei. Für alle.',
    startTime: 3,
    duration: 4,
  },
  {
    text: 'Verbindungen, die',
    subtitle: 'Leben verändern',
    startTime: 7,
    duration: 4,
  },
  {
    text: 'Gemeinsam statt allein',
    subtitle: 'vcan-app.com',
    startTime: 11,
    duration: 4,
  },
];

// Ensure output directories exist
if (!existsSync(OUT_DIR)) {
  mkdirSync(OUT_DIR, { recursive: true });
  console.log(`Created output directory: ${OUT_DIR}`);
}

if (!existsSync(TEMP_DIR)) {
  mkdirSync(TEMP_DIR, { recursive: true });
  console.log(`Created temp directory: ${TEMP_DIR}`);
}

/**
 * Generate text overlay filter for ffmpeg
 */
function generateTextFilter(overlay, index) {
  const { text, subtitle, startTime, duration } = overlay;
  const endTime = startTime + duration;
  
  // Main text styling
  const mainTextFilter = `drawtext=` +
    `fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:` +
    `text='${text}':` +
    `fontcolor=white:fontsize=80:` +
    `x=(w-text_w)/2:y=(h-text_h)/2-40:` +
    `enable='between(t,${startTime},${endTime})':` +
    `alpha='if(lt(t,${startTime + 0.5}),(t-${startTime})/0.5,if(gt(t,${endTime - 0.5}),1-(t-${endTime - 0.5})/0.5,1))'`;
  
  // Subtitle text styling
  const subtitleFilter = `drawtext=` +
    `fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:` +
    `text='${subtitle}':` +
    `fontcolor=white:fontsize=50:` +
    `x=(w-text_w)/2:y=(h-text_h)/2+60:` +
    `enable='between(t,${startTime},${endTime})':` +
    `alpha='if(lt(t,${startTime + 0.5}),(t-${startTime})/0.5,if(gt(t,${endTime - 0.5}),1-(t-${endTime - 0.5})/0.5,1))'`;
  
  return { mainTextFilter, subtitleFilter };
}

/**
 * Create a gradient background video
 */
function createGradientBackground() {
  console.log('Creating gradient background...');
  
  const gradientFile = path.join(TEMP_DIR, 'gradient.mp4');
  
  // Create gradient background (VCan brand colors: #26c6da to #0097a7)
  const cmd = `ffmpeg -y -f lavfi -i color=c=0x26c6da:s=${VIDEO_CONFIG.width}x${VIDEO_CONFIG.height}:d=${VIDEO_CONFIG.duration}:r=${VIDEO_CONFIG.fps} ` +
    `-vf "geq=r='r(X,Y)':g='g(X,Y)*p(X,Y)/255':b='b(X,Y)*0.65*p(X,Y)/255'" ` +
    `-c:v libx264 -preset fast -crf 23 "${gradientFile}"`;
  
  execSync(cmd, { stdio: 'inherit' });
  console.log('✓ Gradient background created');
  
  return gradientFile;
}

/**
 * Add text overlays to video
 */
function addTextOverlays(inputVideo, outputVideo) {
  console.log('Adding text overlays...');
  
  // Build complex filter with all text overlays
  let filterComplex = '';
  let previousOutput = '0:v';
  
  TEXT_OVERLAYS.forEach((overlay, index) => {
    const { mainTextFilter, subtitleFilter } = generateTextFilter(overlay, index);
    
    // Add main text
    filterComplex += `[${previousOutput}]${mainTextFilter}[v${index}a];`;
    previousOutput = `v${index}a`;
    
    // Add subtitle
    filterComplex += `[${previousOutput}]${subtitleFilter}[v${index}b];`;
    previousOutput = `v${index}b`;
  });
  
  // Remove trailing semicolon and set final output
  filterComplex = filterComplex.slice(0, -1);
  
  const cmd = `ffmpeg -y -i "${inputVideo}" ` +
    `-filter_complex "${filterComplex}" ` +
    `-map "[${previousOutput}]" ` +
    `-c:v libx264 -preset medium -crf 23 -movflags +faststart ` +
    `-pix_fmt yuv420p "${outputVideo}"`;
  
  execSync(cmd, { stdio: 'inherit' });
  console.log('✓ Text overlays added');
}

/**
 * Add hero image as picture-in-picture overlay
 */
function addHeroImageOverlay(inputVideo, outputVideo) {
  console.log('Adding hero image overlay...');
  
  const heroImage = path.join(ASSETS_DIR, '41819f8e-51e3-4c75-915e-e11dbbeeb64f.jpg');
  
  if (!existsSync(heroImage)) {
    console.warn('Warning: Hero image not found, skipping image overlay');
    // Just copy the input to output if no hero image
    execSync(`cp "${inputVideo}" "${outputVideo}"`, { stdio: 'inherit' });
    return;
  }
  
  // Scale and position the image with fade effect
  const cmd = `ffmpeg -y -i "${inputVideo}" -loop 1 -i "${heroImage}" ` +
    `-filter_complex "` +
    `[1:v]scale=640:-1,format=yuva420p,` +
    `fade=t=in:st=7:d=0.5:alpha=1,fade=t=out:st=10.5:d=0.5:alpha=1[img];` +
    `[0:v][img]overlay=(W-w)/2:(H-h)/2:enable='between(t,7,11)'[out]" ` +
    `-map "[out]" ` +
    `-c:v libx264 -preset medium -crf 23 -movflags +faststart ` +
    `-pix_fmt yuv420p -t ${VIDEO_CONFIG.duration} "${outputVideo}"`;
  
  execSync(cmd, { stdio: 'inherit' });
  console.log('✓ Hero image overlay added');
}

/**
 * Generate WebM version for web compatibility
 */
function generateWebM(inputVideo, outputVideo) {
  console.log('Generating WebM version...');
  
  const cmd = `ffmpeg -y -i "${inputVideo}" ` +
    `-c:v libvpx-vp9 -b:v 1M -crf 30 -row-mt 1 ` +
    `-pix_fmt yuv420p "${outputVideo}"`;
  
  execSync(cmd, { stdio: 'inherit' });
  console.log('✓ WebM version generated');
}

/**
 * Main video generation function
 */
async function generateVideo() {
  console.log('🎬 Starting VCan promotional video generation...\n');
  
  const startTime = Date.now();
  
  try {
    // Step 1: Create gradient background
    const gradientVideo = createGradientBackground();
    
    // Step 2: Add text overlays
    const textOverlayVideo = path.join(TEMP_DIR, 'with-text.mp4');
    addTextOverlays(gradientVideo, textOverlayVideo);
    
    // Step 3: Add hero image overlay
    const finalVideoMp4 = path.join(OUT_DIR, 'vcan-promo.mp4');
    addHeroImageOverlay(textOverlayVideo, finalVideoMp4);
    
    // Step 4: Generate WebM version
    const finalVideoWebM = path.join(OUT_DIR, 'vcan-promo.webm');
    generateWebM(finalVideoMp4, finalVideoWebM);
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    
    console.log('\n✅ Video generation complete!');
    console.log(`   Time elapsed: ${elapsed}s`);
    console.log(`   Output files:`);
    console.log(`   - ${finalVideoMp4}`);
    console.log(`   - ${finalVideoWebM}`);
    console.log('\nYou can now use these videos in your HTML with:');
    console.log('<video controls>');
    console.log('  <source src="assets/videos/vcan-promo.webm" type="video/webm">');
    console.log('  <source src="assets/videos/vcan-promo.mp4" type="video/mp4">');
    console.log('</video>');
    
  } catch (error) {
    console.error('\n❌ Error generating video:', error.message);
    process.exit(1);
  }
}

// Run the video generation
generateVideo();
