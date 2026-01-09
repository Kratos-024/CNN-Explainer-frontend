const api_uri = "http://127.0.0.1:8000";
interface ImageResponse {
  message: string;
  predicted_class: string;
  ImageR: string;
  ImageG: string;
  ImageB: string;
}

const imageSenderApi = async (
  formData: FormData
): Promise<ImageResponse | undefined> => {
  try {
    console.log("dfdkljjffj");
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

export { imageSenderApi };
export type { ImageResponse };
