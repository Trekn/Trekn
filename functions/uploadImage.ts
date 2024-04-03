import aws from 'aws-sdk';
import { ManagedUpload, PutObjectRequest } from 'aws-sdk/clients/s3';
import { ImagePickerAsset } from 'expo-image-picker';

aws.config.update({
  accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.EXPO_PUBLIC_AWS_REGION,
});

const s3 = new aws.S3();

export const uploadImage = async (image: any) => {
  const { fileName, uri, blobData } = image;
  let fetchResponse;
  let blob;
  if (uri) {
    fetchResponse = await fetch(uri);
    blob = await fetchResponse.blob();
  } else {
    blob = blobData;
  }

  const s3ObjectRequest: PutObjectRequest = {
    Bucket: process.env.EXPO_PUBLIC_AWS_BUCKET_NAME!,
    Body: blob,
    Key: `data/${fileName}`,
    ACL: 'public-read',
  };

  return s3.upload(s3ObjectRequest).promise();
};
