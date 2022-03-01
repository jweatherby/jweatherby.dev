import { Readability, isProbablyReaderable } from '@mozilla/readability'
import { JSDOM } from 'jsdom'

export default function handler(request, response) {

  const { url, html } = request.body
  const doc = new JSDOM(html, { url }).window.document

  if (!isProbablyReaderable(doc)) {
    return response.status(200).json({
      isReadable: false
    })
  }

  const { title, content } = (new Readability(doc)).parse()

  response.status(200).json({
    isReadable: true,
    title,
    content
  });
}