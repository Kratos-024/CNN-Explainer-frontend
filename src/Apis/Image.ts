const api_uri = "http://127.0.0.1:8000";

interface ImageResponse {
  message: string;
  predicted_class: string;
  ImageR: string;
  ImageG: string;
  ImageB: string;
}
interface FeatDataResponse {
  success: boolean;
  data: {
    [key: string]: string[];
  };
  first_relu_images: string[];
}
const classifyNdRGB = async (
  formData: FormData
): Promise<ImageResponse | undefined> => {
  try {
    const response = await fetch(`${api_uri}/classify`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

const getimgData = async (
  formData: FormData
): Promise<FeatDataResponse | undefined> => {
  try {
    const response = await fetch(`${api_uri}/getImageData`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export { classifyNdRGB, getimgData };
export type { ImageResponse };
