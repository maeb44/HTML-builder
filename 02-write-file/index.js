const fs = require('fs/promises');
const path = require('path');


const filePath = path.join(__dirname,'out.txt')

// async function fileExists(path){
// 	try{
// 		await fs.access(path);
// 		return true;
// 	} catch {
// 		return false;
// 	}
// }

process.stdout.write('напиши мне что-то в консоль\n');
process.stdin.setEncoding('utf-8');

process.stdin.on('data', async (input)=>{
	const trim = input.trim();
	if (trim === 'exit') {
		console.log('запись окончена');
		process.exit(0);
	}
	await fs.writeFile(filePath,trim+'\n',{flag:'a'})
	// if(await fileExists(filePath)){
	// 	await fs.appendFile(filePath,trim)
	// }else{
	// 	await fs.writeFile(filePath, 'hello')
	// }
	console.log('данные сохранились в out.txt\n');
})

process.on('SIGINT',()=>{
	console.log('запись окончена');
	process.exit(0)
})

process.on('uncaughtException',(err)=>{
	console.error('UNCAUGHT EXCEPTION:',err.message);
	console.error(err.stack);
	process.exit(1)
})