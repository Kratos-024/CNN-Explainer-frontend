const api_uri = "http://16.170.253.191:8000";
//const api_uri = "http://127.0.0.1:8000";

interface ImageResponse {
  message: string;
  softMax_prob: string[];
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
interface dropoutProp {
  success: boolean;
  images: string[];
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
const applyDropout = async (
  imgs: string[]
): Promise<dropoutProp | undefined> => {
  try {
    const response = await fetch(`${api_uri}/applyDropout`, {
      method: "POST",
      body: JSON.stringify({ Img: imgs }),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};
export { classifyNdRGB, getimgData, applyDropout };
export type { ImageResponse };
