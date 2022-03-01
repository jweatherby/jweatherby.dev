import { Readability, isProbablyReaderable } from '@mozilla/readability'
import { JSDOM } from 'jsdom'

export default function handler(request, response) {

  const doc = new JSDOM(
    request.body,
    {
      title: 'https://www.bbc.co.uk/blogs/internet/entries/41db1cb0-8948-40a9-b2be-22c9494078f6'
    }).window.document

  if (!isProbablyReaderable(doc)) {
    return response.status(200).json({
      isReadable: false
    })
  }

  const { title, content } = (new Readability(doc)).parse()

  response.status(200).json({
    isReadable: false,
    title,
    content
  });
}