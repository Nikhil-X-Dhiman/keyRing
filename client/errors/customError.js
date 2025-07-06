export class UnmatchedPayloadParams extends Error {
	constructor(message) {
		super(message);
		this.name = "ParameterMismatchError";
	}
}

export class CryptoBytesRequirement extends Error {
	constructor(message) {
		super(message);
		this.name = "CryptoBytesRequirement";
	}
}
