const fs = require('fs');

const path = './localisation/'
const root_language = 'english';
const root_language_path = path + root_language + '/';
const langs = fs.readdirSync(path).filter(folder => folder != root_language);

// fs.readdirSync(path + root_language).forEach(file => {
// 	if (fs.statSync(root_language_path + file).isDirectory()) {
// 		console.log(`"${file}" is Dir`);
// 	} else {
// 		console.log(`"${file}" is File`);
// 	}
// });

moveLocales(root_language_path, root_language, langs);

function moveLocales(r_path, lang, langs) {
	fs.readdirSync(r_path).forEach(file => {
		if (file == "l_english.yml") return;
		const path = r_path + file;
		if (fs.statSync(path).isDirectory()) {
			console.log(`"${file}" is Dir`);
			langs.forEach(value => {
				const newdir = path.replaceAll(lang, value);
				if (!fs.existsSync(newdir)) fs.mkdirSync(newdir);
			})
			moveLocales(path + "/", lang, langs);
		} else {
			langs.forEach(value => {
				fs.writeFileSync(path.replaceAll(lang, value), fs.readFileSync(path).toString().replace('l_' + lang, 'l_' + value));
			})
		}
	});
}
