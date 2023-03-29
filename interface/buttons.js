const origButtonWidth = 240;
const borderX = 33;
const outButtonWidth = 180;

const origCenter = origButtonWidth / 2;
const outCenter = outButtonWidth / 2;
const cutWidth = origCenter - outCenter;
const out = origButtonWidth - (cutWidth * 2);

console.log({
	origButtonWidth, borderX, outButtonWidth,
	origCenter, outCenter, cutWidth,
	cutStart: origCenter - cutWidth,
	cutEnd: origCenter + cutWidth,
	test: {
		out,
		proof: out == outButtonWidth
	}
})
