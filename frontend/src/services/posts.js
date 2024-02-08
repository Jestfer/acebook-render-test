// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getPostsbyId = async (userId) => {
  const token = localStorage.getItem("token");

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  // include the userId in the request
  const response = await fetch(
    `${BACKEND_URL}/?userId=${userId}`,
    requestOptions
  );

  if (response.status !== 200) {
    throw new Error("Unable to fetch user's posts");
  }

  const data = await response.json();
  return data;
};

export const getPosts = async () => {
  const requestOptions = {
    method: "GET",
  };

  const response = await fetch(`${BACKEND_URL}/posts`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
};

export const createPost = async (message, imageUrl, token) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message, imageUrl }),
  };

  try {
    const response = await fetch(`${BACKEND_URL}/${posts}`, requestOptions);

    if (!response.ok) {
      throw new Error("Unable to create post");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating post:", error.message);
    // You can log the error or handle it in some way, but don't throw it again here
  }
};

export const deletePostById = async (postId) => {
  const token = localStorage.getItem("token");

  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(`${BACKEND_URL}/${postId}`, requestOptions);

    if (response.status !== 200) {
      throw new Error("Unable to delete post");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export const updatePostById = async (postId, updatedPostData) => {
  const token = localStorage.getItem("token");

  const requestOptions = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedPostData),
  };
  try {
    const response = await fetch(`${BACKEND_URL}/${postId}`, requestOptions);

    if (response.status !== 200) {
      throw new Error("Unable to update post");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};


export const likePost = async (userId, postId, token) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId }),
  };

  try {
    const response = await fetch(
      `${BACKEND_URL}/like/${postId}`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error("Unable to like post");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error liking post:", error.message);
    throw error; // Rethrow the error for higher-level handling if needed
  }
};
