const fs = require('fs/promises');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

(async () => {
  try {
    const secretFiles = await fs.readdir(dirPath, { withFileTypes: true });

    for (const file of secretFiles) {
      if (file.isDirectory()) {
        continue;
      }
      const filePath = path.join(dirPath, file.name);

      const ext = path.parse(file.name);
      const fileName = ext.name;
      const fileExt = ext.ext.replace('.', '');
      const stats = await fs.stat(filePath);
      const fileSizeKb = `${(stats.size / 1024).toFixed(3)}Kb`;

      console.log(`${fileName} - ${fileExt} - ${fileSizeKb}`);
    }
  } catch (error) {
    console.error('ошибка', error.message);
  }
})();
