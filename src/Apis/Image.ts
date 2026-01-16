const api_uri = "https://therianthropic-billie-dubitative.ngrok-free.dev";

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
const getHeaders = (isJson = false) => {
  const headers: HeadersInit = {
    "ngrok-skip-browser-warning": "69420",
  };
  if (isJson) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

const classifyNdRGB = async (
  formData: FormData
): Promise<ImageResponse | undefined> => {
  try {
    const response = await fetch(`${api_uri}/classify`, {
      method: "POST",
      headers: getHeaders(false),
      body: formData,
    });
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Classify Error:", error);
    return undefined;
  }
};

const getimgData = async (
  formData: FormData
): Promise<FeatDataResponse | undefined> => {
  try {
    const response = await fetch(`${api_uri}/getImageData`, {
      method: "POST",
      headers: getHeaders(false),
      body: formData,
    });
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("GetImageData Error:", error);
    return undefined;
  }
};

const applyDropout = async (
  imgs: string[]
): Promise<dropoutProp | undefined> => {
  try {
    const response = await fetch(`${api_uri}/applyDropout`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify({ Img: imgs }),
    });
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Dropout Error:", error);
    return undefined;
  }
};

export { classifyNdRGB, getimgData, applyDropout };
export type { ImageResponse };
