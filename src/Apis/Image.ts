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
  firstConvLayer: string[];
  firstReluLayer: string[];
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
  formData: FormData,
  layer: number
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
