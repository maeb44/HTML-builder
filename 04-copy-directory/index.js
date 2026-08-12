const fs = require('fs/promises');
const path = require('path');

async function copyFolder(src, dist) {
  await fs.mkdir(dist, { recursive: true });

  const copyFiles = await fs.readdir(dist, { withFileTypes: true });
  const files = await fs.readdir(src, { withFileTypes: true });

  for (let e of copyFiles) {
    if (!files.includes(e)) {
      const deleteFilePath = path.join(dist, e.name);
      if (e.isDirectory()) {
        await fs.rm(deleteFilePath, { recursive: true, force: true });
      } else {
        await fs.unlink(deleteFilePath);
      }
    }
  }

  for (let file of files) {
    if (file.isDirectory()) {
      const srcPath = path.join(src, file.name);
      const distPath = path.join(dist, file.name);
      await copyFolder(srcPath, distPath);
      continue;
    }
    const filePath = path.join(src, file.name);
    const copyFilePath = path.join(dist, file.name);
    await fs.copyFile(filePath, copyFilePath);
  }
}

(async () => {
  const src = path.join(__dirname, 'files');
  const dist = path.join(__dirname, 'files-copy');

  await copyFolder(src, dist);
  console.log('Файлы скопированы');
})();
