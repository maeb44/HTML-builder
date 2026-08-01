const { error, Console } = require('console');
const fs = require ('fs/promises');
const path = require('path');



// async function selectChildFolder (){
// 	const files = await fs.readdir(__dirname,{withFileTypes:true})
// 	let dirName = null;
// 	for(let file of files){
// 		if(dirName) return dirName;
// 		console.log(file)
// 		dirName = file.isDirectory() ? file.name : dirName;
// 	}
// 	return null;
// }

async function copyFolder() {
	const folderPath = path.join(__dirname,'files');
	const copyFolderPath = path.join(__dirname,'files-copy')
	
	try{
		await fs.access(copyFolderPath)
		console.log('Папка существует, добавляем файлы')
	}	catch(err){
		await fs.mkdir(copyFolderPath)
		console.log('Создаём папку-копию и добавляем файлы')
	}

	const copyFiles = await fs.readdir(copyFolderPath)
	const files = await fs.readdir(folderPath)
	
	for(let file of files){
		const filePath = path.join(folderPath,file)
		const copyFilePath = path.join(copyFolderPath,file)
		await fs.copyFile(filePath,copyFilePath)
	}
	console.log('файлы скопированы!')
	await deleteExtraFile();
}

async function deleteExtraFile() {
	let logomes = false
	const folderPath = path.join(__dirname,'files');
	const copyFolderPath = path.join(__dirname,'files-copy')
	
	const copyFiles = await fs.readdir(copyFolderPath)
	const files = await fs.readdir(folderPath)


	for(let e of copyFiles){
		if(!files.includes(e)){
			console.log('В папке копии обнаружены лишние файлы, удаляем!')
			if(!logomes) logomes = true;
			const deleteFilePath = path.join(copyFolderPath,e)
			await fs.unlink(deleteFilePath)
		}
	}
	if(logomes){
		console.log('Лишние файлы были удалены!')
	}
	
}



(async () =>{
	await copyFolder();
})()