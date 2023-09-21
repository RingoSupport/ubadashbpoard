function reverseXOR(encoded, maskerKey) {
	const decoded = [];
	for (let i = 0; i < encoded.length; i++) {
		const byte =
			encoded.charCodeAt(i) ^ maskerKey.charCodeAt(i % maskerKey.length);
		decoded.push(String.fromCharCode(byte));
	}
	return decoded.join("");
}

const encodedString =
	"d6M5WCTFRSNd2FUgCM9DJV3DQ3EUxBAhD8VTNA7ZEDATzhAoEt8QJhTGXHEPz1M0FNxVcRyKUz4T2VU/CYpjHC6KQzkS2EQ9BKA5WA==";
const maskerKey = "7DAA3051";

const decodedString = reverseXOR(encodedString, maskerKey);
console.log("Decoded string:", decodedString);
