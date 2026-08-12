import toast from 'react-hot-toast';

export const downloadPayslipPdf = async (elementId = 'infotattva-salary-slip', filename = 'Salary_Slip.pdf') => {
  const sourceElement = document.getElementById('infotattva-salary-slip') || document.getElementById(elementId);
  if (!sourceElement) {
    toast.error('Payslip template element not found');
    return;
  }

  toast.loading('Generating PDF download...', { id: 'pdf-toast' });

  // Create temporary container off-screen
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0px';
  container.style.width = '760px';
  container.style.backgroundColor = '#ffffff';
  container.style.padding = '0';
  container.style.margin = '0';
  container.style.zIndex = '-9999';

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
    }
  `;
  container.appendChild(overrideStyle);

  const clone = sourceElement.cloneNode(true);
  clone.style.backgroundColor = '#ffffff';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';

  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    if (!window.html2pdf) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load PDF engine script'));
        document.head.appendChild(script);
      });
    }

    const opt = {
      margin:       [4, 4, 4, 4],
      filename:     filename,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 760,
        onclone: (clonedDoc) => {
          try {
            const dummyCtx = clonedDoc.createElement('canvas').getContext('2d');
            const targetEl = clonedDoc.getElementById('infotattva-salary-slip') || clonedDoc.body;
            const nodes = [targetEl, ...targetEl.querySelectorAll('*')];

            nodes.forEach((node) => {
              const computed = clonedDoc.defaultView.getComputedStyle(node);
              for (let i = 0; i < computed.length; i++) {
                const prop = computed[i];
                const val = computed.getPropertyValue(prop);
                if (val && val.includes('oklch')) {
                  try {
                    dummyCtx.fillStyle = val;
                    node.style.setProperty(prop, dummyCtx.fillStyle, 'important');
                  } catch (e) {
                    node.style.setProperty(prop, '#000000', 'important');
                  }
                }
              }
            });
          } catch (e) {
            console.warn('onclone sanitization notice:', e);
          }
        }
      },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['avoid-all'] }
    };

    await window.html2pdf().set(opt).from(clone).save();
    toast.success('Salary Slip PDF downloaded!', { id: 'pdf-toast' });
  } catch (err) {
    console.error('PDF download error:', err);
    toast.error('Failed to generate PDF download.');
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
};
