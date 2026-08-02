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

async function copyFolder(src,dist) {
		const folderPath = src;
		const copyFolderPath = dist;

		await fs.mkdir(copyFolderPath,{recursive:true})


	const copyFiles = await fs.readdir(copyFolderPath)
	const files = await fs.readdir(folderPath,{withFileTypes:true})
	
	for(let file of files){
		if(file.isDirectory()){
			const srcPath = path.join(src,file.name)
			const distPath = path.join(dist,file.name)
			copyFolder(srcPath,distPath)
			continue;
		}
		const filePath = path.join(folderPath,file.name)
		const copyFilePath = path.join(copyFolderPath,file.name)
		await fs.copyFile(filePath,copyFilePath)
	}
	await deleteExtraFile(src,dist)
}

async function deleteExtraFile(src,dist) {
	let logomes = false
	const folderPath = src;
	const copyFolderPath = dist;
	
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
	const src = path.join(__dirname,'files')
	const dist = path.join(__dirname,'files-copy')

	await copyFolder(src,dist);
})()