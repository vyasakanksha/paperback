// const path = require('path');
// const fs = require('fs');
// var Papa = require('papaparse')

// function fillMissingData() {
//     const dir = './rawfilesBookBuddy'
//     const files = fs.readdirSync(dir)

//     const start = async () => {
//         await asyncForEach(files, async (file) => {
//             outfile =  "FIXED" + file
//             const f = await fs.createReadStream((path.join(dir, file)));
//             final = []
//             console.log("f", file)
//             if (file.indexOf('BookBuddy') > -1) {
//                 source = 'bookbuddy'
//             } else if (file.indexOf('HandyLibrary') > -1) {
//                 source = 'handylib'
//             }
//             await Papa.parse(f, {
//                 header: true,
//                 complete: async function(results) {
//                     for(let d in results.data){
//                         final.push(results.data[d])
//                         if (final[d]['Date added:']) {
//                             final[d]['Date Added'] = new Date(results.data[d]['Date added:'] + " " + new Date().toLocaleTimeString())
//                             delete final[d]['Date added:'];
//                             await new Promise(resolve => setTimeout(resolve, 1010));
//                         }
//                         final[d]['Title:'] = final[d]['Title:'].split('#')[0].split('[')[0]
//                         if (typeof(final[d]['Author:'].split(',')[1]) != 'undefinied') {
//                             final[d]['Author:'] = final[d]['Author:'].split(',')[1] + ' ' + final[d]['Author:'].split(',')[0]
//                         }
//                         final[d]['Source'] = source
//                         console.log(final[d]['Source'])
//                         console.log(final[d]['Date Added'])
//                         console.log(final[d]['Title'])
//                         console.log(final[d]['Author'])
//                     }
//                     fs.writeFile(path.join(dir, outfile), Papa.unparse(final), 'utf8', function (err) {
//                         if (err) {
//                         console.log('Some error occured - file either not saved or corrupted file saved.');
//                         } else{
//                         console.log('It\'s saved!', outfile);
//                         }
//                     });
//                 }
//             })
//         });
//       }

//     start();
// }

// fillMissingData()