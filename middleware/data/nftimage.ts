import { uploadImage } from "@/functions/uploadImage";
import { supabase } from "@/utils/supabaseClients"
import axios from "axios";

const checkNftImage = async (nftData: any) => {
    const { data } = await supabase.from('image_nft').select('*').eq('address', nftData.address)
    console.log(data);
    if (data && data?.length > 0) {
        console.log('aa', data[0]);
        return data[0].image;
    } else {
        const resultData = await addNftImage(nftData);
        return resultData;
    }
}

const addNftImage = async (nftData: any) => {
    const response = await axios.post(
        'https://api.remove.bg/v1.0/removebg',
        { image_url: nftData.image },
        {
            headers: {
                'X-Api-Key': process.env.EXPO_PUBLIC_REMOVER_BACKGROUND_API_KEY,
            },
            responseType: 'arraybuffer',
        }
    );
    const imageUrl = `https://${process.env.EXPO_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.EXPO_PUBLIC_AWS_REGION}.amazonaws.com/data/${nftData.address}.png`
    await uploadImage({ fileName: `${nftData.address}.png`, blobData: response.data });
    const { data } = await supabase.from('image_nft').insert({ address: nftData.address, image: imageUrl }).select('*');
    console.log(data);
    if (data && data?.length > 0) {
        console.log(data[0]);
        return data[0].image;
    }
}

export { checkNftImage }