const fs = require('fs/promises');
const path = require('path');

async function HTMLBuilder(
  pathDirOfHtmlFiles,
  pathTemplate,
  pathDirOfStyleFiles,
  pathDirAssets,
  pathCopyDir,
  pathFinallyDir,
) {
  const nameOfdir = path.basename(pathFinallyDir);
  console.log(`Создаём проект в папку ${nameOfdir}`);
  await fs.mkdir(pathFinallyDir, { recursive: true });
  await compoundComponents(pathDirOfHtmlFiles, pathTemplate, pathFinallyDir);
  await compoundStyles('.css', pathDirOfStyleFiles, pathFinallyDir);
  await compoundAssets(pathDirAssets, pathCopyDir);
  console.log(`Проект создан в папке ${nameOfdir}`);
}

async function compoundComponents(
  pathDirOfHtmlFiles,
  pathTemplate,
  pathFinallyDir,
) {
  const objOfComponents = {};
  const files = await fs.readdir(pathDirOfHtmlFiles);
  for (let file of files) {
    if (file.endsWith('.html')) {
      const filePath = path.join(pathDirOfHtmlFiles, file);
      const name = file.replace('.html', '');
      objOfComponents[name] = await fs.readFile(filePath, 'utf-8');
    }
  }

  const templateContent = await fs.readFile(pathTemplate, 'utf-8');
  const result = templateContent.replace(/\{\{(.*?)\}\}/g, (match, key) => {
    const cleanKey = key.trim();
    return cleanKey in objOfComponents ? objOfComponents[cleanKey] : match;
  });

  const pathIndexHTML = path.join(pathFinallyDir, 'index.html');

  await fs.writeFile(pathIndexHTML, result, 'utf-8');
}

async function compoundStyles(
  fileExtension,
  pathDirOfStyleFiles,
  pathFinallyDir,
) {
  const styleCss = path.join(pathFinallyDir, 'style.css');

  await fs.writeFile(styleCss, '', 'utf-8');
  const styles = await fs.readdir(pathDirOfStyleFiles, { withFileTypes: true });
  for (let file of styles) {
    if (path.extname(file.name) === fileExtension) {
      // console.log(`${file.name} в процессе мерджа`)
      const fileDir = path.join(pathDirOfStyleFiles, file.name);
      const fileContent = await fs.readFile(fileDir, 'utf-8');
      await fs.appendFile(styleCss, fileContent);
    }
  }
  // console.log(`Файлы замерджены!`)
}
async function compoundAssets(pathDirAssets, pathCopyDir) {
  await fs.mkdir(pathCopyDir, { recursive: true });

  const finallyDir = await fs.readdir(pathCopyDir, { withFileTypes: true });
  const files = await fs.readdir(pathDirAssets, { withFileTypes: true });

  const filesNames = files.map((e) => e.name);

  for (let e of finallyDir) {
    if (!filesNames.includes(e.name)) {
      const deleteFilePath = path.join(pathCopyDir, e.name);
      if (e.isDirectory()) {
        await fs.rm(deleteFilePath, { recursive: true, force: true });
      } else {
        await fs.unlink(deleteFilePath);
      }
    }
  }

  for (let file of files) {
    if (file.isDirectory()) {
      const srcPath = path.join(pathDirAssets, file.name);
      const distPath = path.join(pathCopyDir, file.name);
      await compoundAssets(srcPath, distPath);
      continue;
    }
    const filePath = path.join(pathDirAssets, file.name);
    const copyFilePath = path.join(pathCopyDir, file.name);
    await fs.copyFile(filePath, copyFilePath);
  }
}

(async () => {
  const srcPath = path.join(__dirname, 'project-dist');
  const finallyAssets = path.join(srcPath, 'assets');
  const tempPath = path.join(__dirname, 'template.html');
  const compPath = path.join(__dirname, 'components');
  const stylePath = path.join(__dirname, 'styles');
  const assetsPath = path.join(__dirname, 'assets');

  HTMLBuilder(
    compPath,
    tempPath,
    stylePath,
    assetsPath,
    finallyAssets,
    srcPath,
  );
})();
