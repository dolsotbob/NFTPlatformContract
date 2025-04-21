// (나) 이 파일의 용도: NFT 메타데이터(JSON형식)를 IPFS에 업로드하는 것 
import FormData from 'form-data';
import { jwt } from '../pinata.config';  // Pinata API 인증용 JWT 토큰을 불러온다 
import { createReadStream } from '../fs';
import axios from 'axios';  // HTTP 요청을 보낼 때 사용할 axios를 불러옴
import { uploadFileToIPFS } from './upload.file';

export const uploadMetaData = async () => {
  // const imageUrl = await uploadFileToIPFS();
  // (나) 위 주석 처리된 코드는 이미지를 먼저 IPFS에 업로드하고 그 URL을 메타데이터에 넣으려는 코드(나중에 자동화할 때 쓰면 좋음) 

  // IPFS에 업로드할 JSON 객체 (메타데이터) 정의 
  const metadata = {
    name: '젭라', // Todo: 원하는 이름을 넣습니다.
    description: '제발 나와죠', // Todo: 원하는 이름을 넣습니다.
    // image: imageUrl,
    // (나) 지금은 하드코딩된 이미지 URL 사용하고 있음; 자동화 하려면 위에 있는 uploadFileToIPFS()를 사용하면 됨
    image: 'https://plum-acceptable-gorilla-851.mypinata.cloud/ipfs/bafkreidick7rvsz6kk3azj7q522pm6tinakcczna4hxl3wxpnxvnrj5nd4',
    attributes: [
      // attributes는 어떤 속성(trait_type)에 값(value)을 넣을 것인지 자신의 프로젝트에 따라서 재량것 지정합니다.
      { trait_type: 'Rarity', value: 'Legendary' },
      { trait_type: 'Power', value: 100 },
    ],
  };
  console.log('Metadata : ', metadata);

  // Pinata에 업로드할 전체 데이터를 JSON 문자열로 변환 
  const data = JSON.stringify({
    pinataMetadata: {
      name: metadata.name,
    },
    pinataContent: metadata,
  });

  // 에러가 나도 중단되지 않도록 예외 처리 시작 
  try {
    // Pinata의 JSON 업로드 API에 POST 요청을 보냄 
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      data,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // 업로드 결과로 받은 CID를 이용해 Token URI 생성 (이걸 NFT 스마트 계약에 넣어야 토큰이 올바른 메타데이터를 가리킴)
    const tokenUri = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

    console.log('\n메타데이터를 IPFS에 업로드합니다.');
    console.log('Metadata CID:', response.data.IpfsHash);
    console.log('Token URI:', tokenUri);
    return tokenUri;
  } catch (error: any) {
    console.error(error);
  }
};
