export const jsonResponse = ({ isSuccess, data, isError, error }) => {
	if (isSuccess) {
		return { isSuccess, data, isError: false, error };
	} else if (isError) {
		return { isError: true, error, isSuccess: false, data };
	} else {
		return { isError: true, error: "Something Went Wrong!!!" };
	}
};
