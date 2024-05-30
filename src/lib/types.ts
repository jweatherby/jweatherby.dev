export interface IPostMeta {
  title: string
  blurb: string
  imageSrc: string
  dateCreated: string
  tags: string[]
  isPublished: boolean
}


export interface IPost {
  meta: IPostMeta
  html: string
  slug: string
}

export interface IWorkItem {
  logo: string
  url: string
  slug: string
  name: string
  description: string
  role: string
  dates: string
}