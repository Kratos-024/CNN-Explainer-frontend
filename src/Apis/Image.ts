const api_uri = "http://127.0.0.1:8000";
interface ImageResponse {
  message: string;
  predicted_class: string;
  ImageR: string;
  ImageG: string;
  ImageB: string;
}
interface ImageDataResponse {
  message: string;
  ImageData: [][];
}

const imageSenderApi = async (
  formData: FormData
): Promise<ImageDataResponse | undefined> => {
  try {
    console.log("dfdkljjffj");
    const response = await fetch(`${api_uri}/classify`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getimgData = async (
  formData: FormData
): Promise<ImageResponse | undefined> => {
  try {
    const response = await fetch(`${api_uri}/getImageData`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("dfkfj");
    return data;
  } catch (error) {
    console.log(error);
  }
};

export { imageSenderApi, getimgData };
export type { ImageResponse };
