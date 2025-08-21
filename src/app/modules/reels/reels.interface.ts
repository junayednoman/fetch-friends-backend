import { ObjectId } from "mongoose"

export type TReels = {
  video: string
  caption: string | null
  author: ObjectId
  reactions: ObjectId[]
}