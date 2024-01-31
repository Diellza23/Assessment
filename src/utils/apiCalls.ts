import axios, { AxiosError } from "axios";

export const getUserDataById = async (id: number) => {
  try {
    const res = await axios.get(`https://dummyjson.com/posts?id=${id}`);
    return res.data.posts;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

export const fetchUsersData = async () => {
  try {
    const res = await axios.get("https://dummyjson.com/users");
    return res.data.users;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

export const handleApiError = (error: AxiosError) => {
  if (error.response) {
    const statusCode = error.response.status;

    if (statusCode === 404) {
      return new Error("User not found");
    } else if (statusCode === 500) {
      return new Error("Server error");
    } else {
      return new Error("Unexpected error");
    }
  } else if (error.request) {
    return new Error("No response from server:", error.request);
  } else {
    return new Error("Error placing the req:");
  }
};
