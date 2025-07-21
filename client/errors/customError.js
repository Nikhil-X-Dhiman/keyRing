// example of custom error class
class CustomError extends Error {
	constructor(message, customProperty1 = null) {
		// Call the parent Error constructor
		super(message);

		// Set the name property to the class name
		// This is useful for identifying the error type, often in logs
		this.name = this.constructor.name; // More robust way to set the name

		// Crucial for maintaining a proper stack trace in V8 (Node.js, Chrome)
		// This skips the constructor function itself from the stack trace,
		// making the stack trace point to where the error was *thrown*.
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		} else {
			// For environments that don't support Error.captureStackTrace (e.g., older browsers)
			// This ensures 'instanceof' works correctly after transpilation/minification
			Object.setPrototypeOf(this, CustomError.prototype);
		}

		// Add any custom properties specific to this error type
		this.customProperty1 = customProperty1;
	}
}

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
