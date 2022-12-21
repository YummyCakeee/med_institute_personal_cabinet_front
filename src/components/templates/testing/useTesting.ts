import { useState } from "react"
import { CollectionType, TestBlockType } from "./types"

const useTesting = () => {

    const [collections, setCollections] = useState<CollectionType[]>([])
    const [testBlocks, setTestBlocks] = useState<TestBlockType[]>([])

    return {
        collections,
        setCollections,
        testBlocks,
        setTestBlocks
    }
}

export default useTesting