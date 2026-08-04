const fs = require('fs/promises');
const path = require('path');

const projectDir = path.join(__dirname, 'project-dist');
const stylesDir = path.join(__dirname, 'styles');
const bundle = path.join(projectDir, 'bundle.css');

async function copyStyles(extname) {
  try {
    await fs.access(bundle);
    await fs.writeFile(bundle, '', 'utf-8');
  } catch (err) {
    await fs.writeFile(bundle, '', 'utf-8');
    console.log('Создаём файл и добавляем стили');
  }

  const styles = await fs.readdir(stylesDir, { withFileTypes: true });
  for (let file of styles) {
    if (path.extname(file.name) === extname) {
      console.log(`${file.name} в процессе мерджа`);
      const fileDir = path.join(stylesDir, file.name);
      const fileContent = await fs.readFile(fileDir, 'utf-8');
      await fs.appendFile(bundle, fileContent);
    }
  }
  console.log('Файлы замерджены!');
}

(async () => {
  await copyStyles();
})();
