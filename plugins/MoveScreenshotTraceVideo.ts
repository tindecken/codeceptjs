// plugins/MoveScreenshotTraceVideo.ts
const codeceptEvent = require('codeceptjs').event;
const path = require('path');
const fs = require('fs').promises;
const { glob } = require('glob');

async function moveFileIfExists(sourcePattern, destPath) {
  console.log(`[DEBUG] Looking for files matching: ${sourcePattern}`);
  try {
    const files = await glob(sourcePattern);
    console.log(`[DEBUG] Found ${files.length} matching files`);
    if (files.length > 0) {
      console.log(`[DEBUG] Moving file from: ${files[0]} to: ${destPath}`);
      await fs.rename(files[0], destPath);
      console.log(`[SUCCESS] Moved file to: ${destPath}`);
      return true;
    } else {
      console.log(`[DEBUG] No files found matching pattern: ${sourcePattern}`);
    }
  } catch (err) {
    console.error(`[ERROR] Error moving file: ${err.message}`);
    if (err.code === 'ENOENT') {
      console.error(`[DEBUG] File not found: ${sourcePattern}`);
    }
  }
  return false;
}

module.exports = async function () {
  codeceptEvent.dispatcher.on(codeceptEvent.test.after, async function (test) {
    // Only proceed for failed tests
    if (test.state !== 'failed') return;

    const folderHelper = codeceptjs.container.helpers('FolderHelper');
    if (!folderHelper) return;
      
    const folderPath = folderHelper.getTestFolder(test.id);
    if (!folderPath) return;

    try {
      // Create the destination directory if it doesn't exist
      await fs.mkdir(folderPath, { recursive: true });
      
      // Prepare the base filename from test title
      const baseFilename = test.title.replace(/\s+/g, '_');

      // 1. Move screenshot
      try {
        const screenshotName = `${baseFilename}.failed.png`;
        const screenshotOutputPath = path.join(process.cwd(), 'output', screenshotName);
        const screenshotDestPath = path.join(folderPath, screenshotName);
        await moveFileIfExists(screenshotOutputPath, screenshotDestPath);
      } catch (err) {
        console.error(`[ERROR] Error moving screenshot:`, err);
      }

      // 2. Move trace zip file
      try {
        const traceDir = path.join(process.cwd(), 'output', 'trace');
        console.log(`[DEBUG] Listing files in trace directory: ${traceDir}`);
        
        const traceFiles = await fs.readdir(traceDir);
        console.log(`[DEBUG] Found trace files:`, traceFiles);
        
        // Look for any file that contains the test title and ends with .zip
        const traceFile = traceFiles.find(file => 
          file.includes(baseFilename) && file.endsWith('.zip')
        );
        
        if (traceFile) {
          const traceSrc = path.join(traceDir, traceFile);
          const traceDest = path.join(folderPath, traceFile);
          console.log(`[DEBUG] Moving trace file from: ${traceSrc} to: ${traceDest}`);
          await fs.rename(traceSrc, traceDest);
          console.log(`[SUCCESS] Moved trace file to: ${traceDest}`);
        } else {
          console.log(`[DEBUG] No matching trace file found for test: ${baseFilename}`);
        }
      } catch (err) {
        console.error(`[ERROR] Error processing trace files:`, err);
      }

      // 3. Move video file with retry mechanism
      try {
        const videosDir = path.join(process.cwd(), 'output', 'videos');
        console.log(`[DEBUG] Looking for video files in: ${videosDir}`);
        
        // Retry settings
        const maxRetries = 3;
        const retryDelay = 2000; // 1 second
        let videoMoved = false;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            const videoFiles = await fs.readdir(videosDir);
            console.log(`[DEBUG] Attempt ${attempt}: Found video files:`, videoFiles);
            
            // Look for any file that contains the test title and ends with .webm
            const videoFile = videoFiles.find(file => 
              file.includes(baseFilename) && file.endsWith('.webm')
            );
            
            if (videoFile) {
              const videoSrc = path.join(videosDir, videoFile);
              const videoDest = path.join(folderPath, videoFile);
              console.log(`[DEBUG] Moving video file from: ${videoSrc} to: ${videoDest}`);
              await fs.rename(videoSrc, videoDest);
              console.log(`[SUCCESS] Moved video file to: ${videoDest}`);
              videoMoved = true;
              break;
            } else if (attempt < maxRetries) {
              console.log(`[DEBUG] Video file not found, waiting ${retryDelay}ms before retry (${attempt}/${maxRetries})`);
              await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
          } catch (err) {
            if (err.code === 'ENOENT' && attempt < maxRetries) {
              console.log(`[DEBUG] Videos directory not found, waiting ${retryDelay}ms before retry (${attempt}/${maxRetries})`);
              await new Promise(resolve => setTimeout(resolve, retryDelay));
            } else {
              console.error(`[ERROR] Error accessing videos directory:`, err);
              break;
            }
          }
        }
        
        if (!videoMoved) {
          console.log(`[WARNING] Failed to find or move video file after ${maxRetries} attempts for test: ${baseFilename}`);
        }
      } catch (err) {
        console.error(`[ERROR] Error processing video files:`, err);
      }
    } catch (err) {
      console.error(`[ERROR] Error in test finished handler:`, err);
    }
  });
};
