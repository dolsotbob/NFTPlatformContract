import fs from 'fs';
import path from 'path';
import type * as ethers from 'ethers';

const contractRoot = path.join(__dirname, '..');

// ✅ 프론트엔드 프로젝트의 ABI 저장 경로
const frontendAbiPath = '/Users/j.yoon/Desktop/Jungah/my_first_blog/src/Pages/NFTPlatform/utils';

// ✅ ABI 파일을 복사할 경로들
const outputPaths = [
    path.join(contractRoot, 'abis'),   // 하드햇 프로젝트 내 abis
    frontendAbiPath                    // 프론트엔드 프로젝트 내 utils
];

const makeFile = async (
    location: string,
    destinations: string[], // 여러 경로
    address: string | ethers.Addressable
) => {
    const jsonPath = path.join(contractRoot, location);
    console.log('✅ ABI JSON 읽는 경로:', jsonPath);

    const json = fs.readFileSync(jsonPath, { encoding: 'utf-8' });
    const output = makeData(json, address);

    destinations.forEach((dest) => {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        const filename = path.basename(location);
        const fullPath = path.join(dest, filename);
        console.log('💾 ABI 파일 저장 경로:', fullPath);

        fs.writeFileSync(fullPath, output);
    });
};

const makeData = (json: string, address: string | ethers.Addressable) => {
    const abi = JSON.parse(json).abi;

    return JSON.stringify({
        abi: abi,
        address: address,
    }, null, 2); // 보기 좋게 들여쓰기
};

export const makeAbi = async (
    contract: string,
    address: string | ethers.Addressable
) => {
    const abiRelativePath = `artifacts/contracts/${contract}.sol/${contract}.json`;

    await makeFile(abiRelativePath, outputPaths, address);
};