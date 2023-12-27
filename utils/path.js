import path from 'path';

export const getPath = (relativeFolderPath, fileName) => {
    const basePath = new URL('../', import.meta.url).pathname;
    const folderPath = path.join(basePath, relativeFolderPath);

    return fileName ?
        path.join(folderPath, fileName) :
            path.join(basePath, relativeFolderPath);
}
