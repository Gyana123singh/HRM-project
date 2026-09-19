import html2pdf from 'html2pdf.js';
import toast from 'react-hot-toast';

export const downloadPayslipPdf = async (elementId = 'infotattva-salary-slip', filename = 'Salary_Slip.pdf') => {
  let sourceElement = document.getElementById(elementId) || document.getElementById('infotattva-salary-slip');
  
  // If template element is not present in DOM (e.g. modal opening animation), poll for up to 1.5s
  if (!sourceElement) {
    let retries = 15;
    while (retries > 0 && !sourceElement) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      sourceElement = document.getElementById(elementId) || document.getElementById('infotattva-salary-slip');
      retries--;
    }
  }

  if (!sourceElement) {
    toast.error('Payslip template element not found. Please open the payslip preview modal.');
    return;
  }

  const toastId = 'pdf-toast-' + Date.now();
  toast.loading('Generating PDF download...', { id: toastId });

  // Create temporary container positioned cleanly off-screen with fixed bounds
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '0px';
  container.style.top = '0px';
  container.style.width = '760px';
  container.style.backgroundColor = '#ffffff';
  container.style.padding = '0';
  container.style.margin = '0';
  container.style.zIndex = '99999';
  container.style.opacity = '0';
  container.style.pointerEvents = 'none';

  // Inject CSS variable overrides so Tailwind v4 color variables fallback to HEX
  const overrideStyle = document.createElement('style');
  overrideStyle.textContent = `
    #infotattva-salary-slip, #infotattva-salary-slip * {
      --color-slate-50: #f8fafc !important;
      --color-slate-100: #f1f5f9 !important;
      --color-slate-200: #e2e8f0 !important;
      --color-slate-300: #cbd5e1 !important;
      --color-slate-400: #94a3b8 !important;
      --color-slate-500: #64748b !important;
      --color-slate-600: #475569 !important;
      --color-slate-700: #334155 !important;
      --color-slate-800: #1e293b !important;
      --color-slate-900: #0f172a !important;
      --tw-ring-color: transparent !important;
      --tw-shadow-color: transparent !important;
      --tw-outline-color: transparent !important;
      box-shadow: none !important;
    }
  `;
  container.appendChild(overrideStyle);

  const clone = sourceElement.cloneNode(true);
  clone.style.backgroundColor = '#ffffff';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.transform = 'none';

  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    const getHtml2Pdf = () => {
      if (typeof html2pdf === 'function') return html2pdf;
      if (html2pdf && typeof html2pdf.default === 'function') return html2pdf.default;
      if (window.html2pdf && typeof window.html2pdf === 'function') return window.html2pdf;
      return null;
    };

    let pdfEngine = getHtml2Pdf();

    // Fallback load script from CDN if package module not bound on window
    if (!pdfEngine && !window.html2pdf) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load PDF engine script from CDN'));
        document.head.appendChild(script);
      });
      pdfEngine = window.html2pdf;
    }

    if (!pdfEngine) {
      throw new Error('PDF generation engine unavailable');
    }

    const opt = {
      margin: [4, 4, 4, 4],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 760,
        windowWidth: 800
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    await pdfEngine().set(opt).from(clone).save();
    toast.success('Salary Slip PDF downloaded successfully!', { id: toastId });
  } catch (err) {
    console.error('PDF download error:', err);
    toast.error(`Failed to generate PDF: ${err.message || 'Unknown error'}`, { id: toastId });
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
};

