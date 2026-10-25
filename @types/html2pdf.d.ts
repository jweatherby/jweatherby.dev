declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: { type: string; quality: number };
    html2canvas?: { scale: number };
    jsPDF?: { unit: string; format: string; orientation: string };
    pageBreak?: { mode?: string | string[] };
  }

  /** html2pdf's chained worker: html2pdf().set(options).from(element).save(). */
  interface Html2PdfWorker extends Promise<void> {
    set(options: Html2PdfOptions): Html2PdfWorker;
    from(element: HTMLElement | string): Html2PdfWorker;
    save(filename?: string): Promise<void>;
  }

  export default function html2pdf(
    element?: HTMLElement | string,
    options?: Html2PdfOptions
  ): Html2PdfWorker;
}
