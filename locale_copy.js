const fs = require('fs');
const path = require('path');
const DEBUG = false;

function createDirs(to, langs, dir = '') {
	langs.forEach(lang => {
		const outputDir = path.resolve(to, lang, dir);
		if (fs.existsSync(outputDir)) return;
		fs.mkdirSync(outputDir, { recursive: true });
	})
}

function copyLocales(from, root_lang, to, langs, ignores = [], dir = '') {
	const from_root_lang = path.resolve(from, root_lang, dir);

	fs.readdirSync(from_root_lang)
		.forEach(name => {
			if (ignores.indexOf(name) != -1) return;

			const source = path.resolve(from_root_lang, name);
			if (fs.statSync(source).isDirectory()) {
				const newDir = path.join(dir, name);
				if (DEBUG) console.log("It's dir!",
					{
						input: { from, root_lang, to, langs, ignores, dir },
						from_root_lang,
						source,
						name,
						output: { from, root_lang, to, langs, ignores, dir: newDir }
					}
				);
				createDirs(to, langs, newDir);
				copyLocales(from, root_lang, to, langs, ignores, newDir);
			} else {
				langs.forEach(lang => {
					const output = path.resolve(to, lang, dir, name.replace('l_' + root_lang, 'l_' + lang));
					fs.writeFileSync(output, fs.readFileSync(source).toString().replace('l_' + root_lang, 'l_' + lang));
				})
			}
		})
}

const ALL_LANGS = [
	'english',
	'braz_por',
	'french',
	'german',
	'japanese',
	'korean',
	'polish',
	'russian',
	'simp_chinese',
	'spanish'
];


function main() {
	const cfg = JSON.parse(fs.readFileSync("locale_copy.json", { encoding: 'utf-8' }));
	if (!cfg.path) throw new ReferenceError("\"path\" not defined");
	if (!cfg.in_lang) throw new ReferenceError("\"in_lang\" not defined");

	const root_path = path.resolve(cfg.path);
	const root_lang = cfg.in_lang;
	const langs = cfg.out_langs || ALL_LANGS;
	const ignores = cfg.ignores || [];

	createDirs(root_path, langs);

	copyLocales(root_path, root_lang, root_path, langs, ignores);

	if (!cfg.additivePaths) return;

	cfg.additivePaths.forEach((add_cfg, i) => {
		if (typeof add_cfg === "string") add_cfg = { path: add_cfg };
		if (!add_cfg.path) throw new ReferenceError(`"additivePaths[${i}].path" not defined`);
		add_cfg.path = path.resolve(add_cfg.path);
		add_cfg.in_lang = add_cfg.in_lang || root_lang;
		add_cfg.out_langs = add_cfg.out_langs || langs;
		add_cfg.ignores = add_cfg.ignores || ignores;

		copyLocales(
			add_cfg.path,
			add_cfg.in_lang,
			root_path,
			add_cfg.out_langs,
			add_cfg.ignores
		);
	});
}

main();
