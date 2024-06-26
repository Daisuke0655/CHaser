import React from "react";

const postUserData = async (data) => {
  const jsonData = {
    UserID: data.name,
    Password: data.password,
  };

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jsonData),
    mode: "cors",
  };

  try {
    const response = await fetch(
      "https://kdrlnlqasu54hhc7jgyfqhly7i0nbgkg.lambda-url.ap-northeast-1.on.aws/",
      requestOptions,
    );
    if (response.ok) return 1;
    else return 0;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export default postUserData;
