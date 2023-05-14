// src/utils/cleanFile.ts

export const cleanFileName = (fileName: string): string | undefined => {
    const file = fileName.split('.').shift()
    return file
}