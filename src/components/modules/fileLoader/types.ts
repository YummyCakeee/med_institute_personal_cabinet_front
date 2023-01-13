export type FolderStructureInfoType = {
    folderCount: number,
    fileCount: number,
    folders: FileSystemObjectInfoType[],
    files: FileSystemObjectInfoType[]
}

export type FileSystemObjectInfoType = {
    name: string,
    properties: any
}

export type GetFolderStructureQueryType = {
    currentFolderPath: string,
    fileExtensions?: string[]
}

export type CreateCommandType = {
    currentFolderPath: string,
    name: string
}

export type DeleteCommandType = {
    currentFolderPath: string,
    targetName: string,
    isFile: boolean
}

export type CopyCommandType = {
    currentFolderPath: string,
    sourceDirectory: string,
    name: string,
    isFile: boolean,
    overwrite: boolean
}

export type MoveCommandType = {
    currentFolderPath: string,
    sourceDirectory: string,
    name: string,
    isFile: boolean,
    overwrite: boolean
}

export type RenameCommandType = {
    currentFolderPath: string,
    originName: string,
    newName: string,
    isFile: boolean
}