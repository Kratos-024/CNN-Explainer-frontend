const api_uri = "http://127.0.0.1:8000";

const imageSenderApi = async (
  formData: FormData
): Promise<{ message: string; predicted_class: string } | undefined> => {
  try {
    const response = await fetch(api_uri, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default imageSenderApi;
