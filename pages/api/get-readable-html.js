import { Readability, isProbablyReaderable } from '@mozilla/readability'
import { JSDOM } from 'jsdom'


export default function handler(request, response) {

  const doc = new JSDOM(request.body)
  if (!isProbablyReaderable(doc)) {
    return response.status(200).json({
      body: { isReadable: false }
    })
  }
  const { title, content } = new Readability(doc).parse()

  response.status(200).json({
    body: {
      isReadable: true,
      content,
      title,
    },
    query: request.query,
    cookies: request.cookies,
  });
}