var file_system = require('fs');
var archiver = require('archiver');

var output = file_system.createWriteStream('eX-timecard.zip');
var archive = archiver('zip');

try {
    file_system.unlinkSync('dist/eX-timecard.zip');    
} catch (error) {
    
}

output.on('close', function () {
    file_system.renameSync('eX-timecard.zip', 'dist/eX-timecard.zip', (err) => {
        if (err) throw err;
    });
    
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(err){
    throw err;
});

archive.pipe(output);

archive.directory('dist/', false);

archive.finalize();